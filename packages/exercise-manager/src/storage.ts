import type { SkillId } from '@step-wise/module-tree-definition'
import type { ExerciseAction, ExerciseInstance, ExerciseReport, ExerciseState } from '@sqlvalley/exercise-instances'

// Snapshots must retain their reference until changed, as required by useSyncExternalStore.
export interface ExerciseStorage {
	getInstance(skillId: SkillId): ExerciseInstance | null
	subscribe(listener: () => void): () => void
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
