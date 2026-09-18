import type { ComponentType } from 'react'

import type { ExerciseParameters, ExerciseState } from '@step-wise/exercise-definition'
import type { ExerciseDefinition, ExerciseId } from '@sqlvalley/exercise-instances'

// Presentation and application identity stay outside the logical exercise definition.
export interface ExerciseRegistration {
	exerciseId: ExerciseId
	definition: ExerciseDefinition
	Component: ComponentType
	isSolved: (state: ExerciseState) => boolean
	getSolutionInput?: (parameters: ExerciseParameters) => unknown
}
