import type { ComponentType } from 'react'

import type { Exercise, ExerciseAction, ExerciseMetadata, ExerciseParameters, ExerciseState, SoloExerciseReport } from '@step-wise/exercise-definition'

import type { ExerciseId } from '../storedState'

type SoloDefinition<Parameters extends ExerciseParameters, Action extends ExerciseAction, State extends ExerciseState> =
	Exercise<ExerciseMetadata & { version: number }, Action, State, Parameters, SoloExerciseReport, never, unknown>

export type ExerciseDefinition<
	Parameters extends ExerciseParameters = ExerciseParameters,
	Action extends ExerciseAction = ExerciseAction,
	State extends ExerciseState = ExerciseState,
> = Omit<SoloDefinition<Parameters, Action, State>, 'processSoloAction' | 'processGroupActions'> & {
	processSoloAction: NonNullable<SoloDefinition<Parameters, Action, State>['processSoloAction']>
}

// Presentation and application identity stay outside the logical exercise definition.
export interface ExerciseRegistration {
	exerciseId: ExerciseId
	definition: ExerciseDefinition
	Component: ComponentType
	isSolved: (state: ExerciseState) => boolean
	getSolutionInput?: (parameters: ExerciseParameters) => unknown
}
