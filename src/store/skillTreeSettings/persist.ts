import type { SkillTreeSettingsState } from './types'

function normalizeLastVisitedSkillTrees(raw: unknown): string[] {
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
	hasSeenSkillTreeIntro?: boolean
	hideLegend?: boolean
	lastVisitedSkillTrees?: string[]

	hasAccessedPlanningMode?: boolean
	planningMode?: Record<string, boolean>
	goalNodeID?: Record<string, string | null>
}

export function partializeSkillTreeSettings(state: SkillTreeSettingsState): PersistedSkillTreeSettings {
	return {
		hasSeenSkillTreeIntro: state.hasSeenSkillTreeIntro,
		hideLegend: state.hideLegend,
		lastVisitedSkillTrees: state.lastVisitedSkillTrees,

		hasAccessedPlanningMode: state.hasAccessedPlanningMode,
		planningMode: state.planningMode,
		goalNodeID: state.goalNodeID,
	}
}

export function normalizePersistedSkillTreeSettings(persisted: PersistedSkillTreeSettings | undefined): Partial<SkillTreeSettingsState> {
	if (!persisted) return {}
	const normalized: Partial<SkillTreeSettingsState> = {}

	if (typeof persisted.hasSeenSkillTreeIntro === 'boolean') normalized.hasSeenSkillTreeIntro = persisted.hasSeenSkillTreeIntro
	if (typeof persisted.hideLegend === 'boolean') normalized.hideLegend = persisted.hideLegend
	if (persisted.lastVisitedSkillTrees) normalized.lastVisitedSkillTrees = normalizeLastVisitedSkillTrees(persisted.lastVisitedSkillTrees)

	if (typeof persisted.hasAccessedPlanningMode === 'boolean') normalized.hasAccessedPlanningMode = persisted.hasAccessedPlanningMode
	if (persisted.planningMode && typeof persisted.planningMode === 'object') normalized.planningMode = persisted.planningMode
	if (persisted.goalNodeID) normalized.goalNodeID = persisted.goalNodeID
	return normalized
}
