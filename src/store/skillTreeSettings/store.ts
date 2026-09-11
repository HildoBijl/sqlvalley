import { createPersistedStore } from '../infrastructure'
import { type SkillTreeSettingsState, initialSkillTreeSettingsState } from './state'
import { type SkillTreeSettingsActions, createSkillTreeSettingsActions } from './actions'
import { type PersistedSkillTreeSettings, getPersistedSkillTreeSettings, normalizePersistedSkillTreeSettings } from './persistence'
import { SKILL_TREE_SETTINGS_STORAGE_VERSION, migrateSkillTreeSettings } from './migrations'

const SKILL_TREE_STORAGE_KEY = 'sqlvalley-skilltree'

export const useSkillTreeSettingsStore = createPersistedStore<SkillTreeSettingsState, SkillTreeSettingsActions, PersistedSkillTreeSettings>({
	initialState: initialSkillTreeSettingsState,
	createActions: set => createSkillTreeSettingsActions(set),
	storageKey: SKILL_TREE_STORAGE_KEY,
	version: SKILL_TREE_SETTINGS_STORAGE_VERSION,
	migrate: migrateSkillTreeSettings,
	getPersistedState: getPersistedSkillTreeSettings,
	normalize: normalizePersistedSkillTreeSettings,
})
