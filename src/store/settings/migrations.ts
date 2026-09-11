import { asRecord, runMigrations } from '../infrastructure'
import type { PersistedSettings } from './persistence'

export const SETTINGS_STORE_VERSION = 1

// Migrations: index i transforms payload from version i to i+1.
const MIGRATIONS: Array<(state: PersistedSettings) => PersistedSettings> = [
	// v0 -> v1: no-op (initial versioned payload)
	state => state,
]

export function migrateSettingsPersistedState(persistedState: unknown, fromVersion: number): PersistedSettings {
	const state = asRecord(persistedState) as PersistedSettings
	return runMigrations(state, fromVersion, SETTINGS_STORE_VERSION, MIGRATIONS)
}
