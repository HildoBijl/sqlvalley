import { type HydrationState, createStore } from '../utils'
import { SKILL_TREE_STORAGE_KEY } from './constants'
import { type PersistedSkillTreeSettings, partializeSkillTreeSettings, rehydrateSkillTreeSettings } from './persist'
import { type SkillTreeSettingsActions, type SkillTreeSettingsState, createSkillTreeSettingsActions, initialSkillTreeSettingsState } from './slice'
import { SKILL_TREE_SETTINGS_STORE_VERSION, migrateSkillTreeSettingsPersistedState } from './version'

export interface SkillTreeSettingsStoreState
	extends SkillTreeSettingsState,
		SkillTreeSettingsActions,
		HydrationState {}

export const useSkillTreeSettingsStore = createStore<
	SkillTreeSettingsState,
	SkillTreeSettingsActions,
	PersistedSkillTreeSettings
>({
	initialState: initialSkillTreeSettingsState,
	createActions: set => createSkillTreeSettingsActions(set),
	storageKey: SKILL_TREE_STORAGE_KEY,
	version: SKILL_TREE_SETTINGS_STORE_VERSION,
	migrate: migrateSkillTreeSettingsPersistedState,
	partialize: partializeSkillTreeSettings,
	rehydrate: rehydrateSkillTreeSettings,
})
