import type { ExerciseStorage } from '@sqlvalley/exercise-manager'

import { createPersistedStore } from '../infrastructure'
import { type LearningState, initialLearningState } from './state'
import { type LearningActions, createLearningActions } from './actions'
import { type PersistedLearning, getPersistedLearning, normalizePersistedLearning } from './persistence'
import { LEARNING_STORAGE_VERSION, migrateLearning } from './migrations'

const LEARNING_STORAGE_KEY = 'sqlvalley-learning'

export const useLearningStore = createPersistedStore<LearningState, LearningActions, PersistedLearning>({
	initialState: initialLearningState,
	createActions: set => createLearningActions(set),
	storageKey: LEARNING_STORAGE_KEY,
	version: LEARNING_STORAGE_VERSION,
	migrate: migrateLearning,
	getPersistedState: getPersistedLearning,
	normalize: normalizePersistedLearning,
})

// Read the latest state when the manager performs an operation.
export const exerciseStorage: ExerciseStorage = {
	getInstance: skillId => {
		const module = useLearningStore.getState().modules[skillId]
		if (module?.moduleType !== 'skill') return undefined
		return module.exerciseHistory[module.exerciseHistory.length - 1]
	},
	getHistory: skillId => {
		const module = useLearningStore.getState().modules[skillId]
		return module?.moduleType === 'skill' ? module.exerciseHistory : []
	},
	startExercise: (skillId, exerciseInstance) => useLearningStore.getState().startNewExercise(skillId, exerciseInstance),
	submitAction: (skillId, action, resultingState, report, exerciseDone, increaseSolvedCounter) => useLearningStore.getState().submitExerciseAction(skillId, action, resultingState, report, exerciseDone, increaseSolvedCounter),
	setDraftInput: (skillId, draftInput) => useLearningStore.getState().setExerciseDraftInput(skillId, draftInput),
}
