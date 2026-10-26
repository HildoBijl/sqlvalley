import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { type ModuleId, type ModuleTree, getRequiredModuleIds } from '@step-wise/module-tree-definition'
import { useControllableState } from '@step-wise/react-utils'

import { useSkillTreeData } from '../core/index.ts'
import { type IsModuleCompleted, isModuleReadyToLearn, useSkillTreeProgress } from '../progress/index.ts'

import { SkillTreePlanningContext } from './context.ts'
import type { SkillTreePlanningSettings, SkillTreePlanningStateHandles } from './types.ts'

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

	// Goal module ID: set up storage for the goal module and clear the storage if it's invalid.
	const [storedGoalModuleId, setGoalModuleId] = useControllableState(stateHandles?.goalModuleId, null)
	const goalModuleId = storedGoalModuleId && Object.prototype.hasOwnProperty.call(moduleTree, storedGoalModuleId) ? storedGoalModuleId : null
	useEffect(() => {
		if (storedGoalModuleId && !goalModuleId) setGoalModuleId(null)
	}, [goalModuleId, setGoalModuleId, storedGoalModuleId])

	// Calculate the goal module's path and progress.
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
