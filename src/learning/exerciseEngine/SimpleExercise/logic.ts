import type { StoredExerciseAction } from '@/store';
import type {
  SimpleExerciseAction,
  SimpleExerciseCheckResult,
  SimpleExerciseStoredState,
} from './types';

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

export function reduceSimpleExerciseState<Input, CheckResult = SimpleExerciseCheckResult>({
  action,
  previousState,
}: {
  parameters: Record<string, unknown>;
  action: SimpleExerciseAction<Input, CheckResult>;
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

export function serializeSimpleExerciseAction<Input, CheckResult>(
  action: SimpleExerciseAction<Input, CheckResult>,
): StoredExerciseAction {
  return action.type === 'give-up'
    ? { type: 'give-up' }
    : { type: 'input', input: action.input };
}
