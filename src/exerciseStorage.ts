import type { ExerciseStorage } from '@sqlvalley/exercise-manager'

import { useLearningStore } from '@/store'

/**
 * Adapts the learning store to ExerciseStorage. getInstance returns the raw last
 * exercise so the reference only changes when the exercise does, which is what
 * useSyncExternalStore needs.
 */
export const exerciseStorage: ExerciseStorage = {
	getInstance: skillId => {
		const module = useLearningStore.getState().modules[skillId]
		if (module?.moduleType !== 'skill') return null
		return module.exerciseHistory[module.exerciseHistory.length - 1] ?? null
	},
	subscribe: listener => useLearningStore.subscribe(listener),
	startExercise: (skillId, exerciseInstance) =>
		useLearningStore.getState().startNewExercise(skillId, exerciseInstance),
	submitAction: (skillId, action, resultingState, report, exerciseDone, increaseSolvedCounter) =>
		useLearningStore.getState().submitExerciseAction(
			skillId, action, resultingState, report, exerciseDone, increaseSolvedCounter,
		),
	setDraftInput: (skillId, draftInput) =>
		useLearningStore.getState().setExerciseDraftInput(skillId, draftInput),
}
