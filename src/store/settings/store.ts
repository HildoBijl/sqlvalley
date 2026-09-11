import { type HydrationState, createPersistedStore } from '../infrastructure'
import { type SettingsState, initialSettingsState } from './state'
import { type SettingsActions, createSettingsActions } from './actions'
import { type PersistedSettings, normalizePersistedSettings, partializeSettings } from './persistence'
import { SETTINGS_STORE_VERSION, migrateSettingsPersistedState } from './migrations'

const SETTINGS_STORAGE_KEY = 'sqlvalley-settings'

export interface SettingsStoreState extends SettingsState, SettingsActions, HydrationState { }

export const useSettingsStore = createPersistedStore<
	SettingsState,
	SettingsActions,
	PersistedSettings
>({
	initialState: initialSettingsState,
	createActions: set => createSettingsActions(set),
	storageKey: SETTINGS_STORAGE_KEY,
	version: SETTINGS_STORE_VERSION,
	migrate: migrateSettingsPersistedState,
	partialize: partializeSettings,
	normalize: normalizePersistedSettings,
})
