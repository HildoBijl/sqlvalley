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
