import { type ReactNode, useCallback, useMemo, useState } from 'react'

import { type ModuleId, type ModuleTree, getRequiredModuleIds } from '@step-wise/module-tree-definition'
import { useControllableState } from '@step-wise/react-utils'

import { useSkillTreeData } from '../core'
import { type IsModuleCompleted, isModuleReadyToLearn, useSkillTreeProgress } from '../progress'

import { SkillTreePlanningContext } from './context'
import type { SkillTreePlanningSettings, SkillTreePlanningStateHandles } from './types'

interface SkillTreePlanningProviderProps {
	children: ReactNode
	settings?: SkillTreePlanningSettings
	stateHandles?: SkillTreePlanningStateHandles
}

export function SkillTreePlanningProvider({ children, settings, stateHandles }: SkillTreePlanningProviderProps) {
	const { moduleTree, modulePresentation } = useSkillTreeData()
	const { isModuleCompleted } = useSkillTreeProgress()

	// Planning mode intro: set up the flags that control its visibility and track whether it's been seen.
	const [showPlanningModeIntro, setShowPlanningModeIntro] = useState(false)
	const closePlanningModeIntro = useCallback(() => setShowPlanningModeIntro(false), [])
	const [hasSeenPlanningModeIntro, setHasSeenPlanningModeIntro] = useControllableState(stateHandles?.hasSeenPlanningModeIntro, false)

	// Planning mode: set up the flag for whether the planning mode is on.
	const isPlanningEnabled = settings?.allowPlanningMode ?? false
	const [storedPlanningMode, setPlanningMode] = useControllableState(stateHandles?.isPlanningModeActive, false)
	const isPlanningModeActive = isPlanningEnabled && storedPlanningMode
	const togglePlanningMode = useCallback(() => {
		if (!isPlanningEnabled) return
		if (!isPlanningModeActive && !hasSeenPlanningModeIntro) {
			setShowPlanningModeIntro(true)
			setHasSeenPlanningModeIntro(true)
		}
		setPlanningMode(!isPlanningModeActive)
	}, [hasSeenPlanningModeIntro, isPlanningEnabled, isPlanningModeActive, setHasSeenPlanningModeIntro, setPlanningMode])

	// Goal module ID: set up storage for the goal and calculate its path and progress.
	const [goalModuleId, setGoalModuleId] = useControllableState(stateHandles?.goalModuleId, null)
	const goalPathModuleIds = useMemo(() => new Set(goalModuleId ? getRequiredModuleIds(moduleTree, [goalModuleId]) : []), [goalModuleId, moduleTree])
	const goalProgress = useMemo(() => {
		if (!goalModuleId) return { completedCount: 0, totalCount: 0, nextStepId: null, nextStepName: null }
		const progress = getGoalProgress(moduleTree, goalModuleId, isModuleCompleted)
		return { ...progress, nextStepName: progress.nextStepId ? (modulePresentation[progress.nextStepId]?.name ?? null) : null }
	}, [goalModuleId, isModuleCompleted, modulePresentation, moduleTree])

	// Gather everything into a value object to be published by the context.
	const value = useMemo(() => ({
		showPlanningModeIntro, closePlanningModeIntro,
		isPlanningEnabled, isPlanningModeActive, togglePlanningMode,
		goalModuleId, setGoalModuleId, goalPathModuleIds, goalProgress,
	}), [
		showPlanningModeIntro, closePlanningModeIntro,
		isPlanningEnabled, isPlanningModeActive, togglePlanningMode,
		goalModuleId, setGoalModuleId, goalPathModuleIds, goalProgress,
	])
	return <SkillTreePlanningContext value={value}>{children}</SkillTreePlanningContext>
}

function getGoalProgress(moduleTree: ModuleTree, goalModuleId: ModuleId, isModuleCompleted: IsModuleCompleted) {
	const goalPathModuleIds = getRequiredModuleIds(moduleTree, [goalModuleId])
	return {
		completedCount: goalPathModuleIds.filter(isModuleCompleted).length,
		totalCount: goalPathModuleIds.length,
		nextStepId: goalPathModuleIds.find(id => isModuleReadyToLearn(moduleTree, id, isModuleCompleted)) ?? null,
	}
}
