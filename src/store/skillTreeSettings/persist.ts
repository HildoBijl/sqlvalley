import type { SkillTreeSettingsState } from './types'

function normalizeHistory(raw: unknown): string[] {
	const result: string[] = []
	const seen = new Set<string>()

	if (Array.isArray(raw)) {
		for (const value of raw) {
			if (typeof value !== 'string') continue
			const id = value.trim()
			if (!id || seen.has(id)) continue
			seen.add(id)
			result.push(id)
		}
	}

	return result
}

export interface PersistedSkillTreeSettings {
	goalNodeID?: Record<string, string | null>
	hideLegend?: boolean
	hasAccessedPlanningMode?: boolean
	planningMode?: Record<string, boolean>
	lastVisitedSkillTrees?: string[]
	hasSeenSkillTreeIntro?: boolean
}

export function partializeSkillTreeSettings(
	state: SkillTreeSettingsState,
): PersistedSkillTreeSettings {
	return {
		goalNodeID: state.goalNodeID,
		hideLegend: state.hideLegend,
		hasAccessedPlanningMode: state.hasAccessedPlanningMode,
		planningMode: state.planningMode,
		lastVisitedSkillTrees: state.lastVisitedSkillTrees,
		hasSeenSkillTreeIntro: state.hasSeenSkillTreeIntro,
	}
}

export function rehydrateSkillTreeSettings(
	state: SkillTreeSettingsState,
	persisted: PersistedSkillTreeSettings | undefined,
): void {
	if (!persisted) return

	if (persisted.goalNodeID) state.goalNodeID = persisted.goalNodeID
	if (typeof persisted.hideLegend === 'boolean') state.hideLegend = persisted.hideLegend
	if (typeof persisted.hasAccessedPlanningMode === 'boolean') state.hasAccessedPlanningMode = persisted.hasAccessedPlanningMode
	if (typeof persisted.hasSeenSkillTreeIntro === 'boolean') state.hasSeenSkillTreeIntro = persisted.hasSeenSkillTreeIntro

	if (persisted.planningMode && typeof persisted.planningMode === 'object') {
		state.planningMode = persisted.planningMode
	}

	if (persisted.lastVisitedSkillTrees) {
		state.lastVisitedSkillTrees = normalizeHistory(
			persisted.lastVisitedSkillTrees,
		)
	}
}
