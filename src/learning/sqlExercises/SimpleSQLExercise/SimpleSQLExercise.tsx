import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  SimpleExercise,
  type SimpleExerciseCheckResult,
  type SimpleExerciseControlSlotProps,
  type SimpleExerciseDefinition,
  type SimpleExerciseFeedbackType,
} from '@/learning/exerciseEngine';
import { useDatabase } from '@/learning/databases';
import { useAdminMode } from '@/store/adminMode';
import { useSettingsStore } from '@/store';
import type { DatasetSize } from '@/mockData';
import {
  normalizeSqlInput,
  validateSqlExecution,
  validateSqlInput,
  verifySqlExecution,
  type SqlExecutionResult,
  type SqlQueryResult,
} from '../grading';
import { SimpleSQLRuntimeProvider, type SimpleSQLRuntimeValue } from './runtime';
import {
  createSQLProblem,
  createSQLSolution,
  SQLExerciseInput,
  SQLExerciseOutput,
} from './views';
import type { SimpleSQLExerciseDefinition, SimpleSQLExerciseProps } from './types';
import { ExerciseAdminTools } from './components/ExerciseAdminTools';

const SMALL_DATASET_WARNING =
  'You are using the small data set. This data set is meant to get a quick intuition of the data, but it does not support all exercises. Consider using the full data set to get the full real-life experience.';

export interface SimpleSQLCheckResult extends SimpleExerciseCheckResult {
  feedbackType: SimpleExerciseFeedbackType;
}

export function SimpleSQLExercise<Parameters extends Record<string, unknown>>({
  skillId,
  tables,
  definitions,
  title = 'Exercise',
}: SimpleSQLExerciseProps<Parameters>) {
  const datasetSize = useSettingsStore((state) => state.practiceDatasetSize);
  const setPracticeDatasetSize = useSettingsStore((state) => state.setPracticeDatasetSize);
  const displayDatabase = useDatabase({
    tables,
    size: datasetSize,
    cacheKey: `${skillId}:display`,
    resetOnSchemaChange: true,
  });
  const gradingDatabase = useDatabase({
    tables,
    size: 'full',
    cacheKey: `${skillId}:grading`,
    resetOnSchemaChange: true,
  });
  const [hasExecutedQuery, setHasExecutedQuery] = useState(false);
  const [datasetWarning, setDatasetWarning] = useState<string | null>(null);
  const [pendingDatasetRefresh, setPendingDatasetRefresh] = useState(false);
  const lastExecutedQueryRef = useRef('');
  const latestQueryKeyRef = useRef('');
  const datasetSizeRef = useRef<DatasetSize>(datasetSize);

  const dbReady = displayDatabase.isReady && gradingDatabase.isReady;

  const evaluateSmallDatasetWarning = useCallback(async (
    query: string,
    displayOutput: ReadonlyArray<SqlQueryResult> | null | undefined,
    fullOutput?: ReadonlyArray<SqlQueryResult> | null,
  ) => {
    const queryKey = normalizeSqlInput(query);
    if (!queryKey || datasetSizeRef.current !== 'small' || hasRows(displayOutput)) {
      setDatasetWarning(null);
      return;
    }

    let resolvedFullOutput = fullOutput;
    if (!resolvedFullOutput) {
      try {
        resolvedFullOutput = await gradingDatabase.executeQuery(query);
      } catch {
        setDatasetWarning(null);
        return;
      }
    }
    if (latestQueryKeyRef.current !== queryKey || datasetSizeRef.current !== 'small') return;
    setDatasetWarning(hasRows(resolvedFullOutput) ? SMALL_DATASET_WARNING : null);
  }, [gradingDatabase.executeQuery]);

  const executeLiveQuery = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    latestQueryKeyRef.current = normalizeSqlInput(query);
    setDatasetWarning(null);
    if (!trimmedQuery) {
      lastExecutedQueryRef.current = '';
      setHasExecutedQuery(false);
      displayDatabase.clearQueryState();
      return;
    }

    lastExecutedQueryRef.current = trimmedQuery;
    try {
      const output = await displayDatabase.executeQuery(trimmedQuery);
      setHasExecutedQuery(true);
      await evaluateSmallDatasetWarning(trimmedQuery, output);
    } catch {
      setHasExecutedQuery(false);
    }
  }, [displayDatabase.clearQueryState, displayDatabase.executeQuery, evaluateSmallDatasetWarning]);

  const checkInput = useCallback(async (
    definition: SimpleSQLExerciseDefinition<Parameters>,
    parameters: Parameters,
    input: string,
  ): Promise<SimpleSQLCheckResult> => {
    const query = input.trim();
    lastExecutedQueryRef.current = query;
    latestQueryKeyRef.current = normalizeSqlInput(query);
    setHasExecutedQuery(true);

    let displayExecution: SqlExecutionResult<SqlQueryResult[]>;
    try {
      displayExecution = { success: true, output: await displayDatabase.executeQuery(query) };
    } catch (error) {
      displayExecution = {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }

    const displayOutput = displayExecution.output ?? null;
    let gradingExecution: SqlExecutionResult<SqlQueryResult[]> | null = null;
    let validation = validateSqlExecution(displayExecution);
    if (!validation.ok && datasetSizeRef.current === 'small' &&
      displayExecution.success && !hasRows(displayOutput)) {
      gradingExecution = await executeForGrading(query, gradingDatabase.executeQuery);
      if (gradingExecution.success) {
        validation = validateSqlExecution(gradingExecution);
      }
    }
    if (!validation.ok) {
      await evaluateSmallDatasetWarning(query, displayOutput, gradingExecution?.output ?? null);
      return {
        correct: false,
        feedback: validation.message ?? 'Query result has invalid structure.',
        feedbackType: 'warning',
      };
    }
    if (!gradingDatabase.database) {
      return {
        correct: false,
        feedback: 'Database is not ready for verification. Please try again in a moment.',
        feedbackType: 'warning',
      };
    }

    gradingExecution ??= await executeForGrading(query, gradingDatabase.executeQuery);
    if (!gradingExecution.success || !gradingExecution.output) {
      return {
        correct: false,
        feedback: gradingExecution.error?.message ??
          'Unable to verify results because the grading database query failed.',
        feedbackType: 'error',
      };
    }

    await evaluateSmallDatasetWarning(query, displayOutput, gradingExecution.output);
    const verification = verifySqlExecution({
      output: gradingExecution.output,
      solution: resolveDefinitionValue(definition.solution, parameters),
      database: gradingDatabase.database,
      comparisonOptions: definition.comparisonOptions,
    });
    return {
      correct: verification.correct,
      feedback: verification.message,
      feedbackType: verification.correct ? 'success' : 'error',
    };
  }, [displayDatabase.executeQuery, evaluateSmallDatasetWarning, gradingDatabase.database, gradingDatabase.executeQuery]);

  useEffect(() => {
    datasetSizeRef.current = datasetSize;
    setDatasetWarning(null);
    setHasExecutedQuery(false);
    displayDatabase.clearQueryState();
    setPendingDatasetRefresh(true);
  }, [datasetSize, displayDatabase.clearQueryState]);

  useEffect(() => {
    if (!pendingDatasetRefresh || !displayDatabase.isReady) return;
    const query = lastExecutedQueryRef.current.trim();
    if (!query) {
      setPendingDatasetRefresh(false);
      return;
    }
    let active = true;
    displayDatabase.executeQuery(query)
      .then((output) => {
        if (!active) return;
        setHasExecutedQuery(true);
        void evaluateSmallDatasetWarning(query, output);
      })
      .catch(() => {
        if (!active) return;
        setHasExecutedQuery(false);
        setDatasetWarning(null);
      })
      .finally(() => {
        if (active) setPendingDatasetRefresh(false);
      });
    return () => {
      active = false;
    };
  }, [displayDatabase.executeQuery, displayDatabase.isReady, evaluateSmallDatasetWarning, pendingDatasetRefresh]);

  useEffect(() => () => {
    displayDatabase.resetDatabase();
    gradingDatabase.resetDatabase();
  }, [displayDatabase.resetDatabase, gradingDatabase.resetDatabase]);

  const simpleDefinitions = useMemo<ReadonlyArray<SimpleExerciseDefinition<Parameters, string, SimpleSQLCheckResult>>>(
    () => definitions.map((definition) => ({
      exerciseId: definition.exerciseId,
      version: definition.version,
      generateParameters: definition.generateParameters,
      normalizeInput: normalizeSqlInput,
      isInputEmpty: (input) => !input.trim(),
      validateInput: ({ input }) => {
        const validation = validateSqlInput(input);
        return {
          valid: validation.ok,
          feedback: validation.message,
          feedbackType: validation.ok ? undefined : 'warning',
        };
      },
      checkInput: ({ parameters, input }) => checkInput(definition, parameters, input),
      Problem: createSQLProblem(title, (parameters) => resolveDefinitionValue(definition.problem, parameters)),
      Input: SQLExerciseInput,
      Solution: createSQLSolution((parameters) => resolveDefinitionValue(definition.solution, parameters)),
      Output: SQLExerciseOutput,
    })),
    [checkInput, definitions, title],
  );

  const AdminControls = useMemo(() => {
    const options = definitions.map((definition, index) => ({
      id: definition.exerciseId,
      label: `${index + 1}. ${definition.label ?? resolveStaticLabel(definition.problem, definition.exerciseId)}`,
    }));
    return function SQLAdminControls({
      currentExerciseId,
      startExercise,
      showSolution,
      disabled,
    }: SimpleExerciseControlSlotProps<Parameters>) {
      const isAdmin = useAdminMode();
      return (
        <ExerciseAdminTools
          isAdmin={isAdmin}
          solutionDisabled={disabled}
          selectionDisabled={disabled}
          onShowSolution={showSolution}
          exerciseOptions={options}
          selectedExerciseId={currentExerciseId}
          onExerciseSelect={startExercise}
        />
      );
    };
  }, [definitions]);

  const runtimeValue = useMemo<SimpleSQLRuntimeValue>(() => ({
    dbReady,
    isExecuting: displayDatabase.isExecuting,
    tableNames: displayDatabase.tableNames,
    completionSchema: displayDatabase.completionSchema,
    queryResult: displayDatabase.queryResult,
    queryError: displayDatabase.queryError,
    hasExecutedQuery,
    datasetSize,
    datasetWarning,
    executeLiveQuery,
    setDatasetSize: setPracticeDatasetSize,
  }), [
    datasetSize,
    datasetWarning,
    dbReady,
    displayDatabase.completionSchema,
    displayDatabase.isExecuting,
    displayDatabase.queryError,
    displayDatabase.queryResult,
    displayDatabase.tableNames,
    executeLiveQuery,
    hasExecutedQuery,
    setPracticeDatasetSize,
  ]);

  return (
    <SimpleSQLRuntimeProvider value={runtimeValue}>
      <SimpleExercise
        skillId={skillId}
        definitions={simpleDefinitions}
        initialInput=""
        Controls={AdminControls}
        canSubmit={dbReady && !displayDatabase.isExecuting}
        canGiveUp={!displayDatabase.isExecuting}
      />
    </SimpleSQLRuntimeProvider>
  );
}

async function executeForGrading(
  query: string,
  executeQuery: (query: string) => Promise<SqlQueryResult[]>,
): Promise<SqlExecutionResult<SqlQueryResult[]>> {
  try {
    return { success: true, output: await executeQuery(query) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

function hasRows(results?: ReadonlyArray<SqlQueryResult> | null): boolean {
  return Boolean(results?.some((result) => result.values.length > 0));
}

function resolveDefinitionValue<Parameters extends Record<string, unknown>>(
  value: string | ((parameters: Parameters) => string),
  parameters: Parameters,
): string {
  return typeof value === 'function' ? value(parameters) : value;
}

function resolveStaticLabel<Parameters extends Record<string, unknown>>(
  value: string | ((parameters: Parameters) => string),
  fallback: string,
): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : fallback;
}
