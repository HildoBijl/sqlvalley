import type { SkillId } from '@step-wise/module-tree-definition'
import type { ExerciseAction, ExerciseInstance, ExerciseReport, ExerciseState } from '@sqlvalley/exercise-instances'

import type { ExerciseSessionOptions } from './exerciseSession/types'

// The connections to the data store of the app.
export interface ExerciseStorage {
	getCurrentInstance(skillId: SkillId): ExerciseInstance | undefined
	getExerciseHistory(skillId: SkillId): readonly ExerciseInstance[]
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

export interface ExerciseManagerProps extends ExerciseSessionOptions {
	showAdminControls?: boolean
}
