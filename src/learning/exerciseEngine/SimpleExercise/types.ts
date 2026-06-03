import type { ComponentType } from 'react';

import type { DatasetSize } from '@/mockData';
import type { PracticeFeedback } from '@/learning/components/SkillPractice/types';
import type { PracticeSolution, QueryResultSet } from '@/learning/types';
import type { ExerciseHelpers } from '../types';

export type SimpleExerciseStoredState =
  | Record<string, never>
  | { solved: true }
  | { givenUp: true };

export interface SimpleExerciseValidationResult {
  ok: boolean;
  message?: string;
  code?: string;
  warnings?: string[];
}

export interface SimpleExerciseCheckResult {
  solved: boolean;
  feedback?: string;
  solution?: unknown;
}

export interface SimpleExerciseProblemProps<Parameters extends Record<string, unknown>> {
  parameters: Parameters;
}

export interface SimpleExerciseSolutionProps<Parameters extends Record<string, unknown>> {
  parameters: Parameters;
  state: SimpleExerciseStoredState;
}

export interface SimpleExerciseDefinition<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult = SimpleExerciseCheckResult,
> {
  generateParameters: (
    helpers: ExerciseHelpers,
    context?: { previousParameters?: Parameters | null },
  ) => Parameters;
  validateInput: (args: { parameters: Parameters; input: Input }) => SimpleExerciseValidationResult;
  checkInput: (args: { parameters: Parameters; input: Input }) => CheckResult | Promise<CheckResult>;
  Problem: ComponentType<SimpleExerciseProblemProps<Parameters>>;
  Solution: ComponentType<SimpleExerciseSolutionProps<Parameters>>;
  Prompt?: ComponentType<SimpleExerciseProblemProps<Parameters>>;
  Payoff?: ComponentType<{ parameters: Parameters; result: CheckResult }>;
}

export interface SimpleExerciseOption {
  id: string;
  label: string;
}

export interface SimpleExercisePracticeState {
  title: string;
  query: string;
  feedback: PracticeFeedback | null;
  currentExercise: Record<string, unknown> | null;
  unavailableMessage?: string;
  solution: PracticeSolution | null;
  hasGivenUp: boolean;
  exerciseCompleted: boolean;
  queryResult: ReadonlyArray<QueryResultSet> | null;
  queryError: Error | null;
  description: string;
  tableNames: string[];
  completionSchema: Record<string, string[]>;
  canSubmit: boolean;
  canGiveUp: boolean;
  hasExecutedQuery: boolean;
  datasetSize: DatasetSize;
  datasetWarning: string | null;
  exerciseOptions: SimpleExerciseOption[];
  selectedExerciseId: string | null;
}

export interface SimpleExerciseStatusState {
  dbReady: boolean;
  isExecuting: boolean;
}

export interface SimpleExerciseActions {
  setQuery: (value: string) => void;
  submit: (override?: string) => Promise<void> | void;
  liveExecute: (query: string) => Promise<void> | void;
  autoComplete: (options?: { insertIntoEditor?: boolean }) => Promise<void> | void;
  nextExercise: () => void;
  dismissFeedback: () => void;
  setDatasetSize: (size: DatasetSize) => void;
  selectExercise: (exerciseId: string) => void;
}

export interface SimpleExerciseGiveUpDialog {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  confirmGiveUp: () => void;
}

export interface SimpleExerciseProps {
  practice: SimpleExercisePracticeState;
  status: SimpleExerciseStatusState;
  actions: SimpleExerciseActions;
  dialogs: SimpleExerciseGiveUpDialog;
  isAdmin: boolean;
}
