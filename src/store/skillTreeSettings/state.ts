export interface SkillTreeSettingsState {
	hasSeenSkillTreeIntro: boolean
	hideLegend: boolean
	lastVisitedSkillTrees: string[]
	
	hasAccessedPlanningMode: boolean
	planningMode: Record<string, boolean>
	goalNodeID: Record<string, string | null>
}

export const initialSkillTreeSettingsState: SkillTreeSettingsState = {
	hasSeenSkillTreeIntro: false,
	hideLegend: false,
	lastVisitedSkillTrees: [],

	hasAccessedPlanningMode: false,
	planningMode: {},
	goalNodeID: {},
}
