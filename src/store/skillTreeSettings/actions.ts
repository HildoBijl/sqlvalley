import type { SetState, StateUpdate } from '../infrastructure'
import type { SkillTreeSettingsState } from './state'

export interface SkillTreeSettingsActions {
	setHasSeenSkillTreeIntro: (seen: StateUpdate<boolean>) => void
	setHideLegend: (hide: StateUpdate<boolean>) => void
	markSkillTreeVisited: (treeId: string) => void

	setHasSeenPlanningModeIntro: (seen: StateUpdate<boolean>) => void
	setPlanningMode: (treeId: string, planningMode: StateUpdate<boolean>) => void
	setGoalNodeId: (treeId: string, id: StateUpdate<string | null>) => void
}

export function createSkillTreeSettingsActions(set: SetState<SkillTreeSettingsState>): SkillTreeSettingsActions {
	return {
		setHasSeenSkillTreeIntro: update => set(state => ({ hasSeenSkillTreeIntro: typeof update === 'function' ? update(state.hasSeenSkillTreeIntro) : update })),
		setHideLegend: update => set(state => ({ hideLegend: typeof update === 'function' ? update(state.hideLegend) : update })),
		markSkillTreeVisited: treeId => {
			const normalizedTreeId = treeId.trim()
			if (!normalizedTreeId) return
			set(state => ({ recentSkillTreeIds: [normalizedTreeId, ...state.recentSkillTreeIds.filter(id => id !== normalizedTreeId)] }))
		},

		setPlanningMode: (treeId, update) => set(state => ({ planningModeByTreeId: { ...state.planningModeByTreeId, [treeId]: typeof update === 'function' ? update(state.planningModeByTreeId[treeId] ?? false) : update } })),
		setHasSeenPlanningModeIntro: update => set(state => ({ hasSeenPlanningModeIntro: typeof update === 'function' ? update(state.hasSeenPlanningModeIntro) : update })),
		setGoalNodeId: (treeId, update) => set(state => ({ goalNodeIdByTreeId: { ...state.goalNodeIdByTreeId, [treeId]: typeof update === 'function' ? update(state.goalNodeIdByTreeId[treeId] ?? null) : update } })),
	}
}
