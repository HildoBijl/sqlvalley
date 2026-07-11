import type { ComponentType } from 'react';

import type { ExerciseHelpers } from '../Exercise';
import type {
  SimpleExerciseCheckResult,
  SimpleExerciseInputProps,
  SimpleExerciseOutputProps,
  SimpleExerciseProblemProps,
  SimpleExerciseSolutionProps,
  SimpleExerciseValidationResult,
} from './types';

/** Everything needed to describe a single simple exercise, fed to buildSimpleExercise. */
export interface SimpleExerciseSpecification<
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
  initialInput: Input;
  validateInput?: (
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

export type SimpleExerciseInputAction<Input> =
  | { type: 'input'; input: Input }
  | { type: 'give-up' };
