import type { ComponentType } from 'react'

import type { Exercise, ExerciseAction, ExerciseMetadata, ExerciseParameters, ExerciseState, SoloExerciseReport } from '@step-wise/exercise-definition'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'
import type { ExerciseId } from '@sqlvalley/exercise-instances'

// Presentation and application identity stay outside the logical exercise definition.
export interface ExerciseRegistration<
	Parameters extends ExerciseParameters = ExerciseParameters,
	Action extends ExerciseAction = ExerciseAction,
	State extends ExerciseState = ExerciseState,
> {
	exerciseId: ExerciseId
	definition: Required<Pick<
		Exercise<ExerciseMetadata, Action, State, Parameters, SoloExerciseReport, never, unknown>,
		'metadata' | 'generateParameters' | 'getInitialState' | 'processSoloAction'
	>>
	Component: ComponentType
	isSolved: (state: State) => boolean
	getSolutionInput?: (parameters: Parameters) => InputExerciseRawInput
}
