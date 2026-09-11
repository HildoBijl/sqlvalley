import type { SetState } from '../utils'
import type { SkillTreeSettingsState } from './types'

export const initialSkillTreeSettingsState: SkillTreeSettingsState = {
	hasSeenSkillTreeIntro: false,
	hideLegend: false,
	lastVisitedSkillTrees: [],

	hasAccessedPlanningMode: false,
	planningMode: {},
	goalNodeID: {},
}

export interface SkillTreeSettingsActions {
	setHasSeenSkillTreeIntro: (seen: boolean) => void
	setHideLegend: (hide: boolean) => void
	markSkillTreeVisited: (treeId: string) => void

	setHasAccessedPlanningMode: (accessed: boolean) => void
	setPlanningMode: (treeId: string, planningMode: boolean) => void
	setGoalNodeID: (treeId: string, id: string | null) => void
}

export function createSkillTreeSettingsActions(set: SetState<SkillTreeSettingsState>): SkillTreeSettingsActions {
	return {
		setHasSeenSkillTreeIntro: seen => set({ hasSeenSkillTreeIntro: seen }),
		setHideLegend: hide => set({ hideLegend: hide }),
		markSkillTreeVisited: treeId => {
			const normalizedTreeId = treeId.trim()
			if (!normalizedTreeId) return
			set(state => ({ lastVisitedSkillTrees: [normalizedTreeId, ...state.lastVisitedSkillTrees.filter(id => id !== normalizedTreeId)] }))
		},

		setPlanningMode: (treeId, planningMode) => set(state => ({ planningMode: { ...state.planningMode, [treeId]: planningMode } })),
		setHasAccessedPlanningMode: accessed => set({ hasAccessedPlanningMode: accessed }),
		setGoalNodeID: (treeId, id) => set(state => ({ goalNodeID: { ...state.goalNodeID, [treeId]: id } })),
	}
}
