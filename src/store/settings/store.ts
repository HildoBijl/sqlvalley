import { createPersistedStore } from '../infrastructure'
import { type SettingsState, initialSettingsState } from './state'
import { type SettingsActions, createSettingsActions } from './actions'
import { type PersistedSettings, getPersistedSettings, normalizePersistedSettings } from './persistence'
import { SETTINGS_STORAGE_VERSION, migrateSettings } from './migrations'

const SETTINGS_STORAGE_KEY = 'sqlvalley-settings'

export const useSettingsStore = createPersistedStore<
	SettingsState,
	SettingsActions,
	PersistedSettings
>({
	initialState: initialSettingsState,
	createActions: set => createSettingsActions(set),
	storageKey: SETTINGS_STORAGE_KEY,
	version: SETTINGS_STORAGE_VERSION,
	migrate: migrateSettings,
	getPersistedState: getPersistedSettings,
	normalize: normalizePersistedSettings,
})
