import { type ReactNode, useCallback, useMemo, useState } from 'react'

import { getRequiredModuleIds } from '@step-wise/module-tree-definition'
import { useControllableState } from '@step-wise/react-utils'
import { getGoalProgress } from '@sqlvalley/progress'

import { useSkillTreeData } from '../core'
import { useSkillTreeProgress } from '../progress'

import { SkillTreePlanningContext } from './context'
import type { SkillTreePlanningSettings, SkillTreePlanningStateHandles } from './types'

interface SkillTreePlanningProviderProps {
	children: ReactNode
	settings?: SkillTreePlanningSettings
	stateHandles?: SkillTreePlanningStateHandles
}

export function SkillTreePlanningProvider({ children, settings, stateHandles }: SkillTreePlanningProviderProps) {
	const { moduleTree, modulePresentation } = useSkillTreeData()
	const { isCompleted } = useSkillTreeProgress()

	// Planning mode intro: set up the flags that control its visibility and track whether it's been seen.
	const [showPlanningModeIntro, setShowPlanningModeIntro] = useState(false)
	const closePlanningModeIntro = useCallback(() => setShowPlanningModeIntro(false), [])
	const [hasSeenPlanningModeIntro, setHasSeenPlanningModeIntro] = useControllableState(stateHandles?.hasSeenPlanningModeIntro, false)

	// Planning mode: set up the flag for whether the planning mode is on.
	const planningEnabled = settings?.allowPlanningMode ?? true
	const [storedPlanningMode, setPlanningMode] = useControllableState(stateHandles?.planningMode, false)
	const planningMode = planningEnabled && storedPlanningMode
	const togglePlanningMode = useCallback(() => {
		if (!planningEnabled) return
		if (!planningMode && !hasSeenPlanningModeIntro) {
			setShowPlanningModeIntro(true)
			setHasSeenPlanningModeIntro(true)
		}
		setPlanningMode(!planningMode)
	}, [hasSeenPlanningModeIntro, planningEnabled, planningMode, setHasSeenPlanningModeIntro, setPlanningMode])

	// Goal module ID: set up storage for the goal and calculate its path and progress.
	const [goalModuleId, setGoalModuleId] = useControllableState(stateHandles?.goalModuleId, null)
	const goalPath = useMemo(() => new Set(goalModuleId ? getRequiredModuleIds(moduleTree, [goalModuleId]) : []), [goalModuleId, moduleTree])
	const goalProgress = useMemo(() => {
		if (!goalModuleId) return { completedCount: 0, totalCount: 0, nextStepId: null, nextStepName: null }
		const progress = getGoalProgress(moduleTree, goalModuleId, isCompleted)
		return { ...progress, nextStepName: progress.nextStepId ? (modulePresentation[progress.nextStepId]?.name ?? null) : null }
	}, [goalModuleId, isCompleted, modulePresentation, moduleTree])

	// Gather everything into a value object to be published by the context.
	const value = useMemo(() => ({
		showPlanningModeIntro, closePlanningModeIntro,
		planningEnabled, planningMode, togglePlanningMode,
		goalModuleId, setGoalModuleId, goalPath, goalProgress,
	}), [
		showPlanningModeIntro, closePlanningModeIntro,
		planningEnabled, planningMode, togglePlanningMode,
		goalModuleId, setGoalModuleId, goalPath, goalProgress,
	])
	return <SkillTreePlanningContext value={value}>{children}</SkillTreePlanningContext>
}
