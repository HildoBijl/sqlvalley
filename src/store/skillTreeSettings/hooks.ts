import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { StateUpdate } from '../infrastructure'
import { useSkillTreeSettingsStore } from './store'

// Set up a storage object that can be used by Skill Tree Visualizations.
export function useSkillTreeMemory(treeId: string) {
	// Retrieve all flags/setters from the learning store.
	const memory = useSkillTreeSettingsStore(useShallow(state => ({
		planningMode: state.planningModeByTreeId[treeId] ?? false,
		setPlanningMode: state.setPlanningMode,
		goalNodeId: state.goalNodeIdByTreeId[treeId] ?? null,
		setGoalNodeId: state.setGoalNodeId,
		hasSeenPlanningModeIntro: state.hasSeenPlanningModeIntro,
		setHasSeenPlanningModeIntro: state.setHasSeenPlanningModeIntro,
		hasSeenSkillTreeIntro: state.hasSeenSkillTreeIntro,
		setHasSeenSkillTreeIntro: state.setHasSeenSkillTreeIntro,
		hideLegend: state.hideLegend,
		setHideLegend: state.setHideLegend,
		hasHydrated: state.hasHydrated,
	})))

	// Bundle in the treeId to setters that require it.
	return useMemo(() => ({
		...memory,
		setPlanningMode: (value: StateUpdate<boolean>) => memory.setPlanningMode(treeId, value),
		setGoalNodeId: (value: StateUpdate<string | null>) => memory.setGoalNodeId(treeId, value),
	}), [memory, treeId])
}
