import { Exercise } from '../Exercise';
import { ExerciseManager } from '../ExerciseManager';
import {
  emptySimpleExerciseState,
  isSimpleExerciseGivenUp,
  isSimpleExerciseSolved,
  reduceSimpleExerciseState,
} from './logic';
import { SimpleExerciseView } from './SimpleExerciseView';
import type {
  SimpleExerciseAction,
  SimpleExerciseCheckResult,
  SimpleExerciseDefinition,
  SimpleExerciseProps,
  SimpleExerciseStoredState,
} from './types';

/** Wires the exercise session and manager to the SimpleExercise renderer. */
export function SimpleExercise<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult = SimpleExerciseCheckResult,
>({
  skillId,
  definitions,
  initialInput,
  unavailableMessage,
  Controls,
  canSubmit,
  canGiveUp,
  onSolved,
}: SimpleExerciseProps<Parameters, Input, CheckResult>) {
  return (
    <Exercise<Parameters, SimpleExerciseAction<Input>, SimpleExerciseStoredState>
      skillId={skillId}
      reducer={reduceSimpleExerciseState}
      initialState={emptySimpleExerciseState}
      isComplete={(state) => isSimpleExerciseSolved(state) || isSimpleExerciseGivenUp(state)}
      isSolved={isSimpleExerciseSolved}
    >
      <ExerciseManager<Parameters, SimpleExerciseDefinition<Parameters, Input, CheckResult>>
        exercises={definitions}
        unavailableMessage={unavailableMessage}
      >
        {(definition, { startNewExercise, startExercise }) => (
          <SimpleExerciseView
            definition={definition}
            definitions={definitions}
            initialInput={initialInput}
            Controls={Controls}
            canSubmit={canSubmit}
            canGiveUp={canGiveUp}
            onSolved={onSolved}
            onNext={startNewExercise}
            startExercise={startExercise}
          />
        )}
      </ExerciseManager>
    </Exercise>
  );
}
