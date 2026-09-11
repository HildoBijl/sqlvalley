import { type HydrationState, createStore } from '../utils'
import { LEARNING_STORAGE_KEY } from './constants'
import { type PersistedLearning, normalizePersistedLearning, partializeLearning } from './persist'
import { type LearningActions, createLearningActions, initialLearningState } from './slice'
import type { LearningState } from './types'
import { LEARNING_STORE_VERSION, migrateLearningPersistedState } from './version'

export interface LearningStoreState
	extends LearningState,
		LearningActions,
		HydrationState {}

export const useLearningStore = createStore<
	LearningState,
	LearningActions,
	PersistedLearning
>({
	initialState: initialLearningState,
	createActions: (set, get) => createLearningActions(set, get),
	storageKey: LEARNING_STORAGE_KEY,
	version: LEARNING_STORE_VERSION,
	migrate: migrateLearningPersistedState,
	partialize: partializeLearning,
	normalize: normalizePersistedLearning,
})
