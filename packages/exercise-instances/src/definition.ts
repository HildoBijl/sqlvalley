import type { Exercise, ExerciseAction, ExerciseMetadata, ExerciseParameters, ExerciseState, SoloExerciseReport } from '@step-wise/exercise-definition'

type SoloDefinition<Parameters extends ExerciseParameters, Action extends ExerciseAction, State extends ExerciseState> =
	Exercise<ExerciseMetadata & { version: number }, Action, State, Parameters, SoloExerciseReport, never, unknown>

export type ExerciseDefinition<
	Parameters extends ExerciseParameters = ExerciseParameters,
	Action extends ExerciseAction = ExerciseAction,
	State extends ExerciseState = ExerciseState,
> = Omit<SoloDefinition<Parameters, Action, State>, 'processSoloAction' | 'processGroupActions'> & {
	processSoloAction: NonNullable<SoloDefinition<Parameters, Action, State>['processSoloAction']>
}
