export interface SkillTreeSettingsState {
	hasSeenSkillTreeIntro: boolean
	hideLegend: boolean
	lastVisitedSkillTrees: string[]
	
	hasAccessedPlanningMode: boolean
	planningMode: Record<string, boolean>
	goalNodeID: Record<string, string | null>
}
