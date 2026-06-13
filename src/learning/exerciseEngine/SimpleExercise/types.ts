import type { ComponentType, ReactNode } from 'react';

import type { ExerciseHelpers } from '../Exercise';

export type SimpleExerciseStoredState =
  | Record<string, never>
  | { solved: true }
  | { givenUp: true };

export type SimpleExerciseFeedbackType = 'success' | 'info' | 'warning' | 'error';

export interface SimpleExerciseValidationResult {
  valid: boolean;
  feedback?: string;
  feedbackType?: SimpleExerciseFeedbackType;
  code?: string;
  warnings?: string[];
}

export interface SimpleExerciseCheckResult {
  correct: boolean;
  feedback?: string;
  feedbackType?: SimpleExerciseFeedbackType;
}

export interface SimpleExerciseProblemProps<Parameters extends Record<string, unknown>> {
  parameters: Parameters;
}

export interface SimpleExerciseInputProps<Parameters extends Record<string, unknown>, Input> {
  parameters: Parameters;
  value: Input;
  disabled: boolean;
  onChange: (value: Input) => void;
  onSubmit: () => void;
}

export interface SimpleExerciseSolutionProps<Parameters extends Record<string, unknown>> {
  parameters: Parameters;
  state: SimpleExerciseStoredState;
}

export interface SimpleExerciseOutputProps<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult,
> {
  parameters: Parameters;
  input: Input;
  result: CheckResult | null;
  state: SimpleExerciseStoredState;
}

export interface SimpleExerciseControlSlotProps<Parameters extends Record<string, unknown>> {
  definitions: ReadonlyArray<SimpleExerciseDefinition<Parameters, unknown, unknown>>;
  currentExerciseId: string | null;
  startExercise: (exerciseId: string) => void;
  showSolution: () => void;
  disabled: boolean;
}

export interface SimpleExerciseDefinition<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult = SimpleExerciseCheckResult,
> {
  exerciseId: string;
  version: number;
  generateParameters: (
    helpers: ExerciseHelpers,
    context?: { previousParameters?: Parameters | null },
  ) => Parameters;
  validateInput: (
    args: { parameters: Parameters; input: Input },
  ) => SimpleExerciseValidationResult | Promise<SimpleExerciseValidationResult>;
  checkInput: (args: { parameters: Parameters; input: Input }) => CheckResult | Promise<CheckResult>;
  isCorrect?: (result: CheckResult) => boolean;
  getFeedback?: (result: CheckResult) => string | undefined;
  normalizeInput?: (input: Input) => string;
  isInputEmpty?: (input: Input) => boolean;
  Problem: ComponentType<SimpleExerciseProblemProps<Parameters>>;
  Input: ComponentType<SimpleExerciseInputProps<Parameters, Input>>;
  Solution: ComponentType<SimpleExerciseSolutionProps<Parameters>>;
  Prompt?: ComponentType<SimpleExerciseProblemProps<Parameters>>;
  Payoff?: ComponentType<{ parameters: Parameters; result: CheckResult }>;
  Output?: ComponentType<SimpleExerciseOutputProps<Parameters, Input, CheckResult>>;
}

export type SimpleExerciseAction<Input, CheckResult> =
  | {
      type: 'input';
      input: Input;
      validation: SimpleExerciseValidationResult;
      result?: CheckResult;
      correct: boolean;
    }
  | { type: 'give-up' };

export interface SimpleExerciseProps<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult = SimpleExerciseCheckResult,
> {
  skillId: string;
  definitions: ReadonlyArray<SimpleExerciseDefinition<Parameters, Input, CheckResult>>;
  initialInput: Input;
  unavailableMessage?: ReactNode;
  Controls?: ComponentType<SimpleExerciseControlSlotProps<Parameters>>;
  canSubmit?: boolean;
  canGiveUp?: boolean;
  onSolved?: () => void;
}
