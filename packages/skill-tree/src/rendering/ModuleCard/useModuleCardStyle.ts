import { useTheme } from '@mui/material'

import type { ModuleId } from '@step-wise/module-tree-definition'

import { useSkillTreeData } from '../../core'
import { useSkillTreeInteraction } from '../../interaction'
import { planningColors, useSkillTreePlanning } from '../../planning'
import { isModuleReadyToLearn, progressColors, useSkillTreeProgress } from '../../progress'

interface ModuleCardStyle {
	borderColor: string
	fillColor: string
	opacity: number
	strokeWidth: number
}

export function useModuleCardStyle(moduleId: ModuleId): ModuleCardStyle {
	const theme = useTheme()

	// Derive module data.
	const { moduleTree } = useSkillTreeData()
	if (!moduleTree[moduleId]) throw new Error(`Unknown module "${moduleId}".`)

	// Derive progress-related data.
	const { isModuleCompleted, isProgressTracked } = useSkillTreeProgress()
	const completed = isModuleCompleted(moduleId)
	const readyToLearn = isModuleReadyToLearn(moduleTree, moduleId, isModuleCompleted)

	// Derive interaction-related data.
	const { highlightedModuleId, highlightedPrerequisiteIds } = useSkillTreeInteraction()
	const isHighlightedModule = highlightedModuleId === moduleId
	const isHighlightedPrerequisite = highlightedPrerequisiteIds.has(moduleId)

	// Derive planning-mode-related data.
	const { isPlanningModeActive, goalModuleId, goalPathModuleIds } = useSkillTreePlanning()
	const isGoalModule = isPlanningModeActive && goalModuleId === moduleId
	const isOnGoalPath = isPlanningModeActive && goalPathModuleIds.has(moduleId)
	const hasGoal = goalModuleId !== null

	// Derive combined data.
	const highlighted = isHighlightedModule || isHighlightedPrerequisite
	const dimmed = highlightedModuleId !== null && !highlighted && (!isPlanningModeActive || !isGoalModule)
	const fillColor = isGoalModule ? planningColors.goal : theme.palette.background.paper

	// When the planning mode is on, use the respective styling.
	if (isPlanningModeActive) {
		// Determine the opacity and stroke.
		const prominent = isGoalModule || isOnGoalPath || highlighted || !hasGoal
		const opacity = dimmed || !prominent ? 0.15 : 1
		const strokeWidth = isGoalModule || highlighted ? 2 : 1

		// Determine the border color.
		let borderColor: string
		if (isGoalModule) borderColor = planningColors.goal
		else if (highlighted) borderColor = completed ? progressColors.completed : readyToLearn ? progressColors.ready : progressColors.locked
		else if (completed) borderColor = progressColors.completed
		else if (isOnGoalPath && readyToLearn) borderColor = progressColors.ready
		else if (isOnGoalPath) borderColor = planningColors.goal
		else borderColor = theme.palette.divider

		// Return the combined style.
		return { borderColor, fillColor, opacity, strokeWidth }
	}

	// When no progress data is available, give a static style.
	if (!isProgressTracked) return {
		borderColor: theme.palette.divider,
		fillColor: theme.palette.background.paper,
		opacity: 1,
		strokeWidth: 1,
	}

	// For highlighted skills, show their completion status through a color. It's never dimmed.
	if (highlighted) return {
		borderColor: completed ? progressColors.completed : readyToLearn ? progressColors.ready : progressColors.locked,
		fillColor,
		opacity: 1,
		strokeWidth: 2,
	}

	// For completed skills, show it as green, but check if it should be dimmed.
	if (completed) return {
		borderColor: dimmed ? progressColors.completedFaded : progressColors.completed,
		fillColor,
		opacity: dimmed ? 0.4 : 1,
		strokeWidth: 1,
	}

	// For skills that are ready to learn, show it in yellow, unless it's faded.
	if (readyToLearn) return {
		borderColor: dimmed ? theme.palette.divider : progressColors.ready,
		fillColor,
		opacity: dimmed ? 0.15 : 1,
		strokeWidth: 1,
	}

	// For a skill that cannot be learned yet, fade it.
	return {
		borderColor: theme.palette.divider,
		fillColor,
		opacity: 0.15,
		strokeWidth: 1,
	}
}
