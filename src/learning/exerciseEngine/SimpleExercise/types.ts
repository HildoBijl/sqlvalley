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
