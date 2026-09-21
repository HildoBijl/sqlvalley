import type { SkillId } from '@step-wise/module-tree-definition'
import type { ExerciseAction, ExerciseInstance, ExerciseReport, ExerciseSelectionOptions, ExerciseState } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../exerciseSessionContext'

// The connections to the data store of the app.
export interface ExerciseStorage {
	getInstance(skillId: SkillId): ExerciseInstance | undefined
	getHistory(skillId: SkillId): readonly ExerciseInstance[]
	startExercise(skillId: SkillId, exerciseInstance: ExerciseInstance): void
	submitAction(
		skillId: SkillId,
		action: ExerciseAction,
		state: ExerciseState,
		report: ExerciseReport | undefined,
		exerciseDone: boolean,
		solvedSkillIds: readonly string[],
	): void
	setDraftInput(skillId: SkillId, draftInput: ExerciseInstance['draftInput']): void
}

export interface ExerciseSessionOptions {
	skillId: string
	exercises: readonly ExerciseRegistration[]
	currentExerciseInstance: ExerciseInstance | undefined
	storage: ExerciseStorage
	selectionOptions?: ExerciseSelectionOptions
}

export interface ExerciseManagerProps extends ExerciseSessionOptions {
	showAdminControls?: boolean
}
