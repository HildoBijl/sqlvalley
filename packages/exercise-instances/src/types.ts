import type { ExerciseAction, ExerciseParameters, ExerciseState, SoloExerciseHistoryEvent, SoloExerciseInstance } from '@step-wise/exercise-definition'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'

export type ExerciseId = string
export type ExerciseVersion = number

// Extend exercise events to also have a 'submittedAt' timestamp.
export type ExerciseEvent<Action extends ExerciseAction = ExerciseAction, State extends ExerciseState = ExerciseState> = SoloExerciseHistoryEvent<Action, State> & {
	submittedAt: number
}

// Define an exercise instance. Overwrite the history to use the above events.
export type ExerciseInstance<
	Action extends ExerciseAction = ExerciseAction,
	State extends ExerciseState = ExerciseState,
	Parameters extends ExerciseParameters = ExerciseParameters,
> = Omit<SoloExerciseInstance<Action, State, Parameters>, 'history'> & {
	exerciseId: ExerciseId
	version: ExerciseVersion
	startedAt: number
	history: readonly ExerciseEvent<Action, State>[]
	draftInput?: InputExerciseRawInput
}
