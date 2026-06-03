import type { QueryResult } from '@/components/sql/sqljs/types';

export interface SqlExerciseHelpers {
  selectRandomly: <T>(items: readonly T[]) => T;
  randomInt: (min: number, max: number) => number;
}

export interface SqlExecutionResult<T = QueryResult[]> {
  success: boolean;
  output?: T;
  error?: Error;
}

export interface SqlValidationResult {
  ok: boolean;
  message?: string;
  code?: string;
  warnings?: string[];
}

export interface SqlVerificationResult {
  correct: boolean;
  message?: string;
  solution?: string;
}

export interface SqlInputValidationArgs<Exercise, Input = string, Result = unknown> {
  exercise: Exercise;
  input: Input;
  normalizedInput: string;
  result?: Result | null;
  previousAttempts?: readonly unknown[];
  helpers?: SqlExerciseHelpers;
}
