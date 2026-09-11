import { asRecord, runMigrations } from '../infrastructure'
import type { PersistedSkillTreeSettings } from './persistence'
import { normalizeSkillTreeIds } from './normalization'

export const SKILL_TREE_SETTINGS_STORAGE_VERSION = 3

interface LegacySkillTreeSettings extends PersistedSkillTreeSettings {
	lastVisitedSkillTrees?: unknown
	hasAccessedPlanningMode?: unknown
	planningMode?: unknown
	goalNodeID?: unknown
}

// Migrations: index i transforms payload from version i to i+1.
const MIGRATIONS: Array<(state: PersistedSkillTreeSettings) => PersistedSkillTreeSettings> = [
	// v0 -> v1: no-op (initial versioned payload)
	state => state,

	// v1 -> v2: move skill-tree history into this store.
	state => {
		const legacyState = state as LegacySkillTreeSettings
		return { ...state, lastVisitedSkillTrees: normalizeSkillTreeIds(legacyState.lastVisitedSkillTrees) } as PersistedSkillTreeSettings
	},

	// v2 -> v3: clarify collection and per-tree field names.
	state => {
		const legacyState = state as LegacySkillTreeSettings
		const { lastVisitedSkillTrees, hasAccessedPlanningMode, planningMode, goalNodeID, ...rest } = legacyState
		return {
			...rest,
			recentSkillTreeIds: normalizeSkillTreeIds(lastVisitedSkillTrees),
			hasSeenPlanningModeIntro: hasAccessedPlanningMode,
			planningModeByTreeId: planningMode,
			goalNodeIdByTreeId: goalNodeID,
		} as PersistedSkillTreeSettings
	},
]

export function migrateSkillTreeSettings(persistedState: unknown, fromVersion: number): PersistedSkillTreeSettings {
	const state = asRecord(persistedState) as PersistedSkillTreeSettings
	return runMigrations(state, fromVersion, SKILL_TREE_SETTINGS_STORAGE_VERSION, MIGRATIONS)
}
