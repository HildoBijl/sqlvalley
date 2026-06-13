import type { PracticeSolution, PracticeSolutionLike } from '../types';

export type ExerciseStatus =
  | 'idle'
  | 'ready'
  | 'demo-ready'
  | 'validation-error'
  | 'incorrect'
  | 'correct';

export interface StoredAttempt<Input = string> {
  index: number;
  input: Input;
  normalizedInput: string;
  status: 'invalid' | 'incorrect' | 'correct';
  timestamp: number;
}

export interface StorableExerciseState<Exercise = unknown, Input = unknown> {
  exercise: Exercise;
  status: ExerciseStatus;
  attempts: StoredAttempt<Input>[];
  generatedAt?: number;
}

export interface ValidationResult {
  ok: boolean;
  message?: string;
  code?: string;
  warnings?: string[];
}

export interface VerificationResult {
  correct: boolean;
  message?: string;
  expected?: unknown;
  solution?: PracticeSolutionLike;
}

export interface ExerciseAttempt<Input> extends StoredAttempt<Input> {
  validation?: ValidationResult;
  verification?: VerificationResult;
  feedback: string;
  repeatOf?: number;
}

export interface ExerciseHistoryEntry<Input, Result = unknown> {
  action: ExerciseAction<Input, Result>;
  timestamp: number;
  status: ExerciseStatus;
  attemptIndex?: number;
  feedback?: string | null;
  note?: string;
}

export type StorableExerciseAttempt<Input = unknown> = StoredAttempt<Input>;

export interface ExerciseProgress<Exercise, Input, Demo = unknown, Result = unknown>
  extends StorableExerciseState<Exercise | null, Input> {
  attempts: ExerciseAttempt<Input>[];
  history: ExerciseHistoryEntry<Input, Result>[];
  demo?: Demo;
  validation?: ValidationResult | null;
  verification?: VerificationResult | null;
  feedback?: string | null;
  solution?: PracticeSolutionLike;
  lastAction?: ExerciseAction<Input, Result>;
}

export type ExerciseAction<Input = unknown, Result = unknown> =
  | { type: 'generate'; seed?: number; exercise?: unknown; ensure?: boolean }
  | { type: 'reset'; keepExercise?: boolean }
  | {
      type: 'input';
      input: Input;
      result?: Result | null;
      validation?: ValidationResult | null;
      verification?: VerificationResult | null;
    }
  | { type: 'regenerate-demo' }
  | { type: 'hydrate'; state: ExerciseProgress<any, Input, any, Result> };

export interface ExerciseHelpers {
  selectRandomly<T>(items: readonly T[]): T;
  randomInt(min: number, max: number): number;
}

export interface ExerciseAttemptContext<Exercise, Input, Result> {
  exercise: Exercise;
  input: Input;
  normalizedInput: string;
  result?: Result | null;
  previousAttempts: ExerciseAttempt<Input>[];
  helpers: ExerciseHelpers;
}

export type ValidateInputArgs<Exercise, Input, Result> = ExerciseAttemptContext<Exercise, Input, Result>;

export interface SimpleExerciseConfig<Exercise, Input, Result, Demo = unknown> {
  generateExercise: (
    helpers: ExerciseHelpers,
    context?: { previousExercise?: Exercise | null },
  ) => Exercise;
  validateInput?: (args: ValidateInputArgs<Exercise, Input, Result>) => ValidationResult;
  runDemo?: (args: { exercise: Exercise; helpers: ExerciseHelpers }) => Demo;
  deriveSolution?: (args: { exercise: Exercise; verification?: VerificationResult }) => PracticeSolution | null;
  normalizeInput?: (input: Input) => string;
  feedbackForRepeat?: (args: { previous: ExerciseAttempt<Input>; currentInput: Input }) => string | undefined;
  initialState?: Partial<ExerciseProgress<Exercise, Input, Demo, Result>>;
  helpers?: ExerciseHelpers;
}

/**
 * Generic exercise reducers follow this persistence boundary:
 * parameters plus a submitted action and the previous state produce the next state.
 * The store persists only the action and resulting state; exercise-specific packages
 * decide how to interpret those generic objects.
 */
export type ExerciseStateReducer<Parameters, Action, State> = (args: {
  parameters: Parameters;
  action: Action;
  previousState: State;
}) => State;
