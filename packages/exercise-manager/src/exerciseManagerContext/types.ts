import type { SkillId } from '@step-wise/module-tree-definition'
import type { ExerciseAction } from '@step-wise/exercise-definition'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'
import type { ExerciseId, ExerciseInstance } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from './definition'

// The data about the current exercise.
export interface CurrentExercise {
	definition: ExerciseRegistration['definition']
	instance: ExerciseInstance
}

// Handlers connecting the exercise to the data store, set up by the manager.
export interface ExerciseControls<Action extends ExerciseAction> {
	submitAction: (action: Action) => Promise<void>
	setDraftInput: (draftInput: InputExerciseRawInput | undefined) => void
	startNewExercise: () => void
	selectExerciseById: (exerciseId: ExerciseId) => void
	showSolution?: () => void
}

// The full contents of the ExerciseManagerContext.
export interface ExerciseManagerContextValue {
	currentExercise: CurrentExercise
	showAdminControls: boolean
	exerciseIds: readonly ExerciseId[]
	pending: boolean
	controls: ExerciseControls<ExerciseAction>
	skillId: SkillId
}
