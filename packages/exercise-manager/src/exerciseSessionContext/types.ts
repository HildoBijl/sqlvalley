import type { ComponentType } from 'react'

import type { SkillId } from '@step-wise/module-tree-definition'
import type { AnyExercise, ExerciseAction } from '@step-wise/exercise-definition'
import type { ExerciseId, ExerciseInstance } from '@sqlvalley/exercise-instances'

// The data made available to the exercise consists of the following items.
export interface ExerciseSessionContextValue {
	skillId: SkillId
	context: unknown
	currentExercise: CurrentExercise
	controls: ExerciseControls<ExerciseAction>
	submitting: boolean
	admin: ExerciseAdminControls
}

// An exercise in the frontend consists of its definition and its rendering component.
export interface ExerciseRegistration {
	exerciseId: ExerciseId
	definition: AnyExercise
	Component: ComponentType<ExerciseSessionContextValue>
}

// The current exercise has a specific definition and an instantiation.
export interface CurrentExercise {
	definition: AnyExercise
	instance: ExerciseInstance
}

// Handlers connecting the exercise to the data store, set up by the manager.
export interface ExerciseControls<Action extends ExerciseAction> {
	startNewExercise: () => void
	setDraftInput: (draftInput: ExerciseInstance['draftInput']) => void
	submitAction: (action: Action) => Promise<void>
}

// Admin visibility and exercise selection.
export interface ExerciseAdminControls {
	showControls: boolean
	exerciseIds: readonly ExerciseId[]
	selectExerciseById: (exerciseId: ExerciseId) => void
}

// Loading status is separate from the context consumed by exercise code.
export type ExerciseResources<Context = unknown> =
	| { loading: true; error?: Error; context?: Context }
	| { loading: false; error: Error; context?: Context }
	| { loading: false; error?: undefined; context: Context }
