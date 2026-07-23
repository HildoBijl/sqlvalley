import type { StoredExerciseState } from '@/store';
import type { SimpleExerciseStoredState } from './types';

export const emptySimpleExerciseState: SimpleExerciseStoredState = {};

export function isSimpleExerciseSolved(state: StoredExerciseState | undefined): boolean {
  return !!state && 'solved' in state && state.solved === true;
}

export function isSimpleExerciseGivenUp(state: StoredExerciseState | undefined): boolean {
  return !!state && 'givenUp' in state && state.givenUp === true;
}
