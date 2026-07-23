import type { AsyncExerciseReducer, StoredExerciseState } from '@/store';
import type { AnyExerciseDefinition } from '../Exercise';
import { emptySimpleExerciseState, isSimpleExerciseGivenUp, isSimpleExerciseSolved } from './logic';
import { SimpleExerciseComponent } from './SimpleExerciseComponent';
import type { SimpleExerciseSpecification } from './specifications';
import type { SimpleExerciseCheckResult, SimpleExerciseFeedbackType } from './types';

export interface SimpleExerciseFeedback {
  message: string;
  type: SimpleExerciseFeedbackType;
  result?: unknown;
}

/** Turns a simple exercise specification into a generic ExerciseDefinition. */
export function buildSimpleExercise<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult = SimpleExerciseCheckResult,
>(spec: SimpleExerciseSpecification<Parameters, Input, CheckResult>): AnyExerciseDefinition {
  const isComplete = (state: StoredExerciseState) =>
    isSimpleExerciseSolved(state) || isSimpleExerciseGivenUp(state);

  const reduce: AsyncExerciseReducer = async ({ parameters, action, previousState }) => {
    if (isSimpleExerciseSolved(previousState) || isSimpleExerciseGivenUp(previousState)) {
      return { state: previousState };
    }
    if (action.type === 'give-up') {
      return { state: { givenUp: true } };
    }

    const input = (action as { input: Input }).input;
    const params = parameters as Parameters;
    const validation = await spec.validateInput?.({ parameters: params, input });
    if (validation && !validation.valid) {
      const feedback: SimpleExerciseFeedback = {
        message: validation.feedback ?? 'Please double-check your input before submitting.',
        type: validation.feedbackType ?? 'warning',
      };
      return { state: emptySimpleExerciseState, feedback };
    }

    const result = await spec.checkInput({ parameters: params, input });
    const correct = spec.isCorrect
      ? spec.isCorrect(result)
      : Boolean((result as SimpleExerciseCheckResult).correct);
    const checkResult = result as SimpleExerciseCheckResult;
    const feedback: SimpleExerciseFeedback = {
      message: spec.getFeedback?.(result) ??
        checkResult.feedback ??
        (correct ? 'Correct!' : 'Not quite right. Try again.'),
      type: checkResult.feedbackType ?? (correct ? 'success' : 'error'),
      result,
    };
    return { state: correct ? { solved: true } : emptySimpleExerciseState, feedback };
  };

  return {
    exerciseId: spec.exerciseId,
    version: spec.version,
    generateParameters: spec.generateParameters as AnyExerciseDefinition['generateParameters'],
    initialState: emptySimpleExerciseState,
    isComplete,
    isSolved: isSimpleExerciseSolved,
    Component: () => (
      <SimpleExerciseComponent
        spec={spec}
        reduce={reduce}
        isComplete={isComplete}
        isSolved={isSimpleExerciseSolved}
      />
    ),
  };
}
