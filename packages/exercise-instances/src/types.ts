import type { ExerciseAction, ExerciseParameters, ExerciseState, SoloExerciseHistoryEvent, SoloExerciseInstance } from '@step-wise/exercise-definition'

export type ExerciseId = string
export type ExerciseVersion = number
export type SkillId = string

export type ExerciseEvent<Action extends ExerciseAction = ExerciseAction, State extends ExerciseState = ExerciseState> = SoloExerciseHistoryEvent<Action, State> & {
	submittedAt: number
}

export type ExerciseInstance<
	Parameters extends ExerciseParameters = ExerciseParameters,
	Action extends ExerciseAction = ExerciseAction,
	State extends ExerciseState = ExerciseState,
> = Omit<SoloExerciseInstance<Action, State, Parameters>, 'history'> & {
	exerciseId: ExerciseId
	version: ExerciseVersion
	startedAt: number
	history: readonly ExerciseEvent<Action, State>[]
	draftInput?: unknown
}
