import { asRecord, parseRecord } from '../infrastructure'
import type { SkillTreeSettingsState } from './state'
import { normalizeSkillTreeIds } from './normalization'

export interface PersistedSkillTreeSettings {
	hasSeenSkillTreeIntro?: boolean
	hideLegend?: boolean
	recentSkillTreeIds?: string[]

	hasSeenPlanningModeIntro?: boolean
	planningModeByTreeId?: Record<string, boolean>
	goalNodeIdByTreeId?: Record<string, string | null>
}

export function getPersistedSkillTreeSettings(state: SkillTreeSettingsState): PersistedSkillTreeSettings {
	return {
		hasSeenSkillTreeIntro: state.hasSeenSkillTreeIntro,
		hideLegend: state.hideLegend,
		recentSkillTreeIds: state.recentSkillTreeIds,

		hasSeenPlanningModeIntro: state.hasSeenPlanningModeIntro,
		planningModeByTreeId: state.planningModeByTreeId,
		goalNodeIdByTreeId: state.goalNodeIdByTreeId,
	}
}

export function normalizePersistedSkillTreeSettings(persisted: unknown): Partial<SkillTreeSettingsState> {
	const source = asRecord(persisted)
	const normalized: Partial<SkillTreeSettingsState> = {}

	if (typeof source.hasSeenSkillTreeIntro === 'boolean') normalized.hasSeenSkillTreeIntro = source.hasSeenSkillTreeIntro
	if (typeof source.hideLegend === 'boolean') normalized.hideLegend = source.hideLegend
	if (Array.isArray(source.recentSkillTreeIds)) normalized.recentSkillTreeIds = normalizeSkillTreeIds(source.recentSkillTreeIds)

	if (typeof source.hasSeenPlanningModeIntro === 'boolean') normalized.hasSeenPlanningModeIntro = source.hasSeenPlanningModeIntro
	const planningModeByTreeId = parseRecord(source.planningModeByTreeId, (value): value is boolean => typeof value === 'boolean')
	if (planningModeByTreeId) normalized.planningModeByTreeId = planningModeByTreeId
	const goalNodeIdByTreeId = parseRecord(source.goalNodeIdByTreeId, (value): value is string | null => typeof value === 'string' || value === null)
	if (goalNodeIdByTreeId) normalized.goalNodeIdByTreeId = goalNodeIdByTreeId
	
	return normalized
}
