import { asRecord, runMigrations } from '../infrastructure'
import type { PersistedSettings } from './persistence'

export const SETTINGS_STORAGE_VERSION = 2

interface LegacySettings extends PersistedSettings {
	currentTheme?: unknown
}

// Migrations: index i transforms payload from version i to i+1.
const MIGRATIONS: Array<(state: PersistedSettings) => PersistedSettings> = [
	// v0 -> v1: no-op (initial versioned payload)
	state => state,

	// v1 -> v2: rename currentTheme to themeMode.
	state => {
		const legacyState = state as LegacySettings
		if (legacyState.themeMode !== undefined) return state
		const { currentTheme, ...rest } = legacyState
		return { ...rest, themeMode: currentTheme } as PersistedSettings
	},
]

export function migrateSettings(persistedState: unknown, fromVersion: number): PersistedSettings {
	const state = asRecord(persistedState) as PersistedSettings
	return runMigrations(state, fromVersion, SETTINGS_STORAGE_VERSION, MIGRATIONS)
}
