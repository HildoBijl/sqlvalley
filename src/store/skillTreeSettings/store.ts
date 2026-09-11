import { type HydrationState, createPersistedStore } from '../infrastructure'
import { type SkillTreeSettingsState, initialSkillTreeSettingsState } from './state'
import { type SkillTreeSettingsActions, createSkillTreeSettingsActions } from './actions'
import { type PersistedSkillTreeSettings, normalizePersistedSkillTreeSettings, partializeSkillTreeSettings } from './persistence'
import { SKILL_TREE_SETTINGS_STORE_VERSION, migrateSkillTreeSettingsPersistedState } from './migrations'

const SKILL_TREE_STORAGE_KEY = 'sqlvalley-skilltree'

export interface SkillTreeSettingsStoreState extends SkillTreeSettingsState, SkillTreeSettingsActions, HydrationState { }

export const useSkillTreeSettingsStore = createPersistedStore<SkillTreeSettingsState, SkillTreeSettingsActions, PersistedSkillTreeSettings>({
	initialState: initialSkillTreeSettingsState,
	createActions: set => createSkillTreeSettingsActions(set),
	storageKey: SKILL_TREE_STORAGE_KEY,
	version: SKILL_TREE_SETTINGS_STORE_VERSION,
	migrate: migrateSkillTreeSettingsPersistedState,
	partialize: partializeSkillTreeSettings,
	normalize: normalizePersistedSkillTreeSettings,
})
