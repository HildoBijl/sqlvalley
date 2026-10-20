import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { StateUpdate } from '../infrastructure'
import { useSkillTreeSettingsStore } from './store'

// Set up persisted state handles for a skill-tree visualization.
export function useSkillTreeStateHandles(treeId: string) {
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

	// Bundle values and setters into the state handles expected by the visualization.
	return useMemo(() => ({
		planning: {
			isPlanningModeActive: [memory.planningMode, (value: StateUpdate<boolean>) => memory.setPlanningMode(treeId, value)] as const,
			goalModuleId: [memory.goalNodeId, (value: StateUpdate<string | null>) => memory.setGoalNodeId(treeId, value)] as const,
			hasSeenPlanningModeIntro: [memory.hasSeenPlanningModeIntro, memory.setHasSeenPlanningModeIntro] as const,
		},
		intro: {
			hasSeenIntro: [memory.hasSeenSkillTreeIntro, memory.setHasSeenSkillTreeIntro] as const,
		},
		legend: {
			hidden: [memory.hideLegend, memory.setHideLegend] as const,
		},
		isReady: memory.hasHydrated,
	}), [memory, treeId])
}
