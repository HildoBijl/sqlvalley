import { type HydrationState, createPersistedStore } from '../infrastructure'
import { type LearningState, initialLearningState } from './state'
import { type LearningActions, createLearningActions } from './actions'
import { type PersistedLearning, normalizePersistedLearning, partializeLearning } from './persistence'
import { LEARNING_STORE_VERSION, migrateLearningPersistedState } from './migrations'

const LEARNING_STORAGE_KEY = 'sqlvalley-learning'

export interface LearningStoreState extends LearningState, LearningActions, HydrationState { }

export const useLearningStore = createPersistedStore<LearningState, LearningActions, PersistedLearning>({
	initialState: initialLearningState,
	createActions: (set, get) => createLearningActions(set, get),
	storageKey: LEARNING_STORAGE_KEY,
	version: LEARNING_STORE_VERSION,
	migrate: migrateLearningPersistedState,
	partialize: partializeLearning,
	normalize: normalizePersistedLearning,
})
