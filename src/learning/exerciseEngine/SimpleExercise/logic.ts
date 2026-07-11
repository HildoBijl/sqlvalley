import type { StoredExerciseState } from '@/store';
import type { SimpleExerciseAction, SimpleExerciseStoredState } from './types';

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

export function isSimpleExerciseSolved(state: StoredExerciseState | undefined): boolean {
  return !!state && 'solved' in state && state.solved === true;
}

export function isSimpleExerciseGivenUp(state: StoredExerciseState | undefined): boolean {
  return !!state && 'givenUp' in state && state.givenUp === true;
}

export function reduceSimpleExerciseState<Input>({
  action,
  previousState,
}: {
  parameters: Record<string, unknown>;
  action: SimpleExerciseAction<Input>;
  previousState: SimpleExerciseStoredState;
}): SimpleExerciseStoredState {
  if (isSimpleExerciseSolved(previousState) || isSimpleExerciseGivenUp(previousState)) {
    return previousState;
  }
  if (action.type === 'give-up') {
    return { givenUp: true };
  }
  return action.correct ? { solved: true } : emptySimpleExerciseState;
}
