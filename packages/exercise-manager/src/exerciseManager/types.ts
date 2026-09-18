import type { SkillId } from '@step-wise/module-tree-definition'
import type { ExerciseAction, ExerciseInstance, ExerciseReport, ExerciseSelectionOptions, ExerciseState } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../exerciseManagerContext'

// Imperative reads keep asynchronous operations working with the latest stored data.
export interface ExerciseStorage {
	getInstance(skillId: SkillId): ExerciseInstance | undefined
	// Oldest first, including the current instance.
	getHistory(skillId: SkillId): readonly ExerciseInstance[]
	startExercise(skillId: SkillId, exerciseInstance: ExerciseInstance): void
	submitAction(
		skillId: SkillId,
		action: ExerciseAction,
		state: ExerciseState,
		report: ExerciseReport | undefined,
		exerciseDone: boolean,
		increaseSolvedCounter: boolean,
	): void
	setDraftInput(skillId: SkillId, draftInput: ExerciseInstance['draftInput']): void
}

export interface ExerciseSessionOptions {
	storage: ExerciseStorage
	currentExerciseInstance: ExerciseInstance | undefined
	skillId: string
	exercises: readonly ExerciseRegistration[]
	selectionOptions?: ExerciseSelectionOptions
}

export interface ExerciseManagerProps extends ExerciseSessionOptions {
	showAdminControls?: boolean
}
