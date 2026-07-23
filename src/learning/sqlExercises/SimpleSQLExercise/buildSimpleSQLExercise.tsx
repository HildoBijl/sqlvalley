import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  SimpleExerciseComponent,
  emptySimpleExerciseState,
  isSimpleExerciseGivenUp,
  isSimpleExerciseSolved,
  useExercise,
  type AnyExerciseDefinition,
  type SimpleExerciseFeedback,
  type SimpleExerciseRenderSpec,
} from '@/learning/exerciseEngine';
import { useDatabase } from '@/learning/databases';
import { useSettingsStore } from '@/store';
import type { AsyncExerciseReducer, StoredExerciseState } from '@/store';
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
import { createSQLProblem, createSQLSolution, SQLExerciseInput, SQLExerciseOutput } from './views';
import type { SimpleSQLCheckResult, SimpleSQLExerciseSpec } from './types';

const SMALL_DATASET_WARNING =
  'You are using the small data set. This data set is meant to get a quick intuition of the data, but it does not support all exercises. Consider using the full data set to get the full real-life experience.';

/** Turns one SQL exercise into an ExerciseDefinition the manager can render. */
export function buildSimpleSQLExercise<Parameters extends Record<string, unknown>>(
  spec: SimpleSQLExerciseSpec<Parameters>,
): AnyExerciseDefinition {
  const { exerciseId, version, generateParameters, tables, comparisonOptions, title = 'Exercise' } = spec;

  const renderSpec: SimpleExerciseRenderSpec<Parameters, string, SimpleSQLCheckResult> = {
    initialInput: '',
    normalizeInput: normalizeSqlInput,
    isInputEmpty: (input) => !input.trim(),
    Problem: createSQLProblem(title, (parameters) => resolveValue(spec.problem, parameters)),
    Input: SQLExerciseInput,
    Solution: createSQLSolution((parameters) => resolveValue(spec.solution, parameters)),
    Output: SQLExerciseOutput,
  };

  const isComplete = (state: StoredExerciseState) =>
    isSimpleExerciseSolved(state) || isSimpleExerciseGivenUp(state);

  // Sets up the skill's databases (shared via the App-level provider cache) and the
  // live-query runtime, then renders the generic component with a db-aware reducer.
  function SimpleSQLExerciseComponent() {
    const { skillId } = useExercise();
    const datasetSize = useSettingsStore((state) => state.practiceDatasetSize);
    const setPracticeDatasetSize = useSettingsStore((state) => state.setPracticeDatasetSize);
    const displayDatabase = useDatabase({
      tables, size: datasetSize, cacheKey: `${skillId}:display`, resetOnSchemaChange: true,
    });
    const gradingDatabase = useDatabase({
      tables, size: 'full', cacheKey: `${skillId}:grading`, resetOnSchemaChange: true,
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

    const grade = useCallback(async (
      parameters: Parameters,
      rawInput: string,
    ): Promise<SimpleSQLCheckResult> => {
      const query = rawInput.trim();
      lastExecutedQueryRef.current = query;
      latestQueryKeyRef.current = normalizeSqlInput(query);
      setHasExecutedQuery(true);

      let displayExecution: SqlExecutionResult<SqlQueryResult[]>;
      try {
        displayExecution = { success: true, output: await displayDatabase.executeQuery(query) };
      } catch (error) {
        displayExecution = { success: false, error: error instanceof Error ? error : new Error(String(error)) };
      }

      const displayOutput = displayExecution.output ?? null;
      let gradingExecution: SqlExecutionResult<SqlQueryResult[]> | null = null;
      let validation = validateSqlExecution(displayExecution);
      if (!validation.ok && datasetSizeRef.current === 'small' &&
        displayExecution.success && !hasRows(displayOutput)) {
        gradingExecution = await executeForGrading(query, gradingDatabase.executeQuery);
        if (gradingExecution.success) validation = validateSqlExecution(gradingExecution);
      }
      if (!validation.ok) {
        await evaluateSmallDatasetWarning(query, displayOutput, gradingExecution?.output ?? null);
        return { correct: false, feedback: validation.message ?? 'Query result has invalid structure.', feedbackType: 'warning' };
      }
      if (!gradingDatabase.database) {
        return { correct: false, feedback: 'Database is not ready for verification. Please try again in a moment.', feedbackType: 'warning' };
      }

      gradingExecution ??= await executeForGrading(query, gradingDatabase.executeQuery);
      if (!gradingExecution.success || !gradingExecution.output) {
        return { correct: false, feedback: gradingExecution.error?.message ?? 'Unable to verify results because the grading database query failed.', feedbackType: 'error' };
      }

      await evaluateSmallDatasetWarning(query, displayOutput, gradingExecution.output);
      const verification = verifySqlExecution({
        output: gradingExecution.output,
        solution: resolveValue(spec.solution, parameters),
        database: gradingDatabase.database,
        comparisonOptions,
      });
      return { correct: verification.correct, feedback: verification.message, feedbackType: verification.correct ? 'success' : 'error' };
    }, [displayDatabase.executeQuery, evaluateSmallDatasetWarning, gradingDatabase.database, gradingDatabase.executeQuery]);

    const reduce = useCallback<AsyncExerciseReducer>(async ({ parameters, action, previousState }) => {
      if (isSimpleExerciseSolved(previousState) || isSimpleExerciseGivenUp(previousState)) {
        return { state: previousState };
      }
      if (action.type === 'give-up') {
        return { state: { givenUp: true } };
      }
      const input = String((action as { input?: unknown }).input ?? '');
      const inputValidation = validateSqlInput(input);
      if (!inputValidation.ok) {
        const feedback: SimpleExerciseFeedback = {
          message: inputValidation.message ?? 'Please double-check your input before submitting.',
          type: 'warning',
        };
        return { state: emptySimpleExerciseState, feedback };
      }
      const result = await grade(parameters as Parameters, input);
      const feedback: SimpleExerciseFeedback = { message: result.feedback ?? '', type: result.feedbackType, result };
      return { state: result.correct ? { solved: true } : emptySimpleExerciseState, feedback };
    }, [grade]);

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
      return () => { active = false; };
    }, [displayDatabase.executeQuery, displayDatabase.isReady, evaluateSmallDatasetWarning, pendingDatasetRefresh]);

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
        <SimpleExerciseComponent
          spec={renderSpec}
          reduce={reduce}
          isComplete={isComplete}
          isSolved={isSimpleExerciseSolved}
        />
      </SimpleSQLRuntimeProvider>
    );
  }

  return {
    exerciseId,
    version,
    generateParameters: generateParameters as AnyExerciseDefinition['generateParameters'],
    initialState: emptySimpleExerciseState,
    isComplete,
    isSolved: isSimpleExerciseSolved,
    Component: SimpleSQLExerciseComponent,
  };
}

async function executeForGrading(
  query: string,
  executeQuery: (query: string) => Promise<SqlQueryResult[]>,
): Promise<SqlExecutionResult<SqlQueryResult[]>> {
  try {
    return { success: true, output: await executeQuery(query) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

function hasRows(results?: ReadonlyArray<SqlQueryResult> | null): boolean {
  return Boolean(results?.some((result) => result.values.length > 0));
}

function resolveValue<Parameters extends Record<string, unknown>>(
  value: string | ((parameters: Parameters) => string),
  parameters: Parameters,
): string {
  return typeof value === 'function' ? value(parameters) : value;
}
