import type { SimpleExerciseStoredState } from './types';

export const emptySimpleExerciseState: SimpleExerciseStoredState = {};

export function getSimpleExerciseState(args?: {
  solved?: boolean;
  givenUp?: boolean;
}): SimpleExerciseStoredState {
  if (args?.solved) {
    return { solved: true };
  }

  if (args?.givenUp) {
    return { givenUp: true };
  }

  return emptySimpleExerciseState;
}

export function isSimpleExerciseSolved(state: SimpleExerciseStoredState | undefined): boolean {
  return !!state && 'solved' in state && state.solved === true;
}

export function isSimpleExerciseGivenUp(state: SimpleExerciseStoredState | undefined): boolean {
  return !!state && 'givenUp' in state && state.givenUp === true;
}
