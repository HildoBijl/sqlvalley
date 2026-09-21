import type { ComponentType } from 'react'

import type { SkillId } from '@step-wise/module-tree-definition'
import type { Exercise, ExerciseAction, ExerciseMetadata, ExerciseParameters, ExerciseState, SoloExerciseReport } from '@step-wise/exercise-definition'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'
import type { ExerciseId, ExerciseInstance } from '@sqlvalley/exercise-instances'

// Presentation and application identity stay outside the logical exercise definition.
export interface ExerciseRegistration<
	Action extends ExerciseAction = ExerciseAction,
	State extends ExerciseState = ExerciseState,
	Parameters extends ExerciseParameters = ExerciseParameters,
> {
	exerciseId: ExerciseId
	definition: Required<Pick<
		Exercise<ExerciseMetadata, Action, State, Parameters, SoloExerciseReport, never, unknown>,
		'metadata' | 'generateParameters' | 'getInitialState' | 'processSoloAction'
	>>
	Component: ComponentType
}

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
}

// The full contents of the ExerciseSessionContext.
export interface ExerciseSessionContextValue {
	currentExercise: CurrentExercise
	showAdminControls: boolean
	exerciseIds: readonly ExerciseId[]
	pending: boolean
	controls: ExerciseControls<ExerciseAction>
	skillId: SkillId
}
