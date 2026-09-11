import { type HydrationState, createStore } from '../utils'
import { SETTINGS_STORAGE_KEY } from './constants'
import { type PersistedSettings, partializeSettings, rehydrateSettings } from './persist'
import { type SettingsActions, type SettingsState, createSettingsActions, initialSettingsState } from './slice'
import { SETTINGS_STORE_VERSION, migrateSettingsPersistedState } from './version'

export interface SettingsStoreState
	extends SettingsState,
		SettingsActions,
		HydrationState {}

export const useSettingsStore = createStore<
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
	rehydrate: rehydrateSettings,
})
