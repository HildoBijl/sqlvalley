import { asRecord } from '../utils'
import { parseRecord } from '../validation'
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

export function normalizePersistedSkillTreeSettings(persisted: unknown): Partial<SkillTreeSettingsState> {
	const source = asRecord(persisted)
	const normalized: Partial<SkillTreeSettingsState> = {}

	if (typeof source.hasSeenSkillTreeIntro === 'boolean') normalized.hasSeenSkillTreeIntro = source.hasSeenSkillTreeIntro
	if (typeof source.hideLegend === 'boolean') normalized.hideLegend = source.hideLegend
	if (Array.isArray(source.lastVisitedSkillTrees)) normalized.lastVisitedSkillTrees = normalizeLastVisitedSkillTrees(source.lastVisitedSkillTrees)

	if (typeof source.hasAccessedPlanningMode === 'boolean') normalized.hasAccessedPlanningMode = source.hasAccessedPlanningMode
	const planningMode = parseRecord(source.planningMode, (value): value is boolean => typeof value === 'boolean')
	if (planningMode) normalized.planningMode = planningMode
	const goalNodeID = parseRecord(source.goalNodeID, (value): value is string | null => typeof value === 'string' || value === null)
	if (goalNodeID) normalized.goalNodeID = goalNodeID
	
	return normalized
}
