export interface SkillTreeSettingsState {
	hasSeenSkillTreeIntro: boolean
	hideLegend: boolean
	recentSkillTreeIds: string[]
	
	hasSeenPlanningModeIntro: boolean
	planningModeByTreeId: Record<string, boolean>
	goalNodeIdByTreeId: Record<string, string | null>
}

export const initialSkillTreeSettingsState: SkillTreeSettingsState = {
	hasSeenSkillTreeIntro: false,
	hideLegend: false,
	recentSkillTreeIds: [],

	hasSeenPlanningModeIntro: false,
	planningModeByTreeId: {},
	goalNodeIdByTreeId: {},
}
