import type { SetState } from '../infrastructure'
import type { SkillTreeSettingsState } from './state'

export interface SkillTreeSettingsActions {
	setHasSeenSkillTreeIntro: (seen: boolean) => void
	setHideLegend: (hide: boolean) => void
	markSkillTreeVisited: (treeId: string) => void

	setHasSeenPlanningModeIntro: (seen: boolean) => void
	setPlanningMode: (treeId: string, planningMode: boolean) => void
	setGoalNodeId: (treeId: string, id: string | null) => void
}

export function createSkillTreeSettingsActions(set: SetState<SkillTreeSettingsState>): SkillTreeSettingsActions {
	return {
		setHasSeenSkillTreeIntro: seen => set({ hasSeenSkillTreeIntro: seen }),
		setHideLegend: hide => set({ hideLegend: hide }),
		markSkillTreeVisited: treeId => {
			const normalizedTreeId = treeId.trim()
			if (!normalizedTreeId) return
			set(state => ({ recentSkillTreeIds: [normalizedTreeId, ...state.recentSkillTreeIds.filter(id => id !== normalizedTreeId)] }))
		},

		setPlanningMode: (treeId, planningMode) => set(state => ({ planningModeByTreeId: { ...state.planningModeByTreeId, [treeId]: planningMode } })),
		setHasSeenPlanningModeIntro: hasSeenPlanningModeIntro => set({ hasSeenPlanningModeIntro }),
		setGoalNodeId: (treeId, id) => set(state => ({ goalNodeIdByTreeId: { ...state.goalNodeIdByTreeId, [treeId]: id } })),
	}
}
