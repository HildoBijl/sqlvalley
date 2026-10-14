import { useTheme } from '@mui/material'

import type { ModuleId } from '@step-wise/module-tree-definition'
import { isReadyToLearn } from '@sqlvalley/progress'

import { useSkillTreeData } from '../../core'
import { useSkillTreeInteraction } from '../../interaction'
import { useSkillTreePlanning } from '../../planning'
import { useSkillTreeProgress } from '../../progress'
import { treeColors } from '../../styles'

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
	const { isCompleted, hasProgress } = useSkillTreeProgress()
	const completed = isCompleted(moduleId)
	const readyToLearn = isReadyToLearn(moduleTree, moduleId, isCompleted)

	// Derive interaction-related data.
	const { hoveredModuleId, hoveredPrerequisiteIds } = useSkillTreeInteraction()
	const isHovered = hoveredModuleId === moduleId
	const isPrerequisite = hoveredPrerequisiteIds.has(moduleId)
	
	// Derive planning-mode-related data.
	const { planningMode, goalModuleId, goalPath } = useSkillTreePlanning()
	const isGoalModule = planningMode && goalModuleId === moduleId
	const isOnGoalPath = planningMode && goalPath.has(moduleId)
	const hasGoal = goalModuleId !== null
	
	// Derive combined data.
	const highlighted = isHovered || isPrerequisite
	const dimmed = hoveredModuleId !== null && !highlighted && (!planningMode || !isGoalModule)
	const fillColor = isGoalModule ? treeColors.goal : theme.palette.background.paper

	// When no progress data is available, give a static style.
	if (!hasProgress) return { borderColor: theme.palette.divider, fillColor: theme.palette.background.paper, opacity: 1, strokeWidth: 1 }

	// When the planning mode is on, use the respective styling.
	if (planningMode) {
		// Determine the opacity and stroke.
		const prominent = isGoalModule || isOnGoalPath || highlighted || !hasGoal
		const opacity = dimmed || !prominent ? 0.15 : 1
		const strokeWidth = isGoalModule || highlighted ? 2 : 1

		// Determine the border color.
		let borderColor: string
		if (isGoalModule) borderColor = treeColors.goal
		else if (highlighted) borderColor = completed ? treeColors.completed : readyToLearn ? treeColors.ready : treeColors.locked
		else if (completed) borderColor = treeColors.completed
		else if (isOnGoalPath && readyToLearn) borderColor = treeColors.ready
		else if (isOnGoalPath) borderColor = treeColors.goal
		else borderColor = theme.palette.divider

		// Return the combined style.
		return { borderColor, fillColor, opacity, strokeWidth }
	}

	// For highlighted skills, show their completion status through a color. It's never dimmed.
	if (highlighted) {
		return {
			borderColor: completed ? treeColors.completed : readyToLearn ? treeColors.ready : treeColors.locked,
			fillColor,
			opacity: 1,
			strokeWidth: 2,
		}
	}

	// For completed skills, show it as green, but check if it should be dimmed.
	if (completed) {
		return {
			borderColor: dimmed ? treeColors.completedFaded : treeColors.completed,
			fillColor,
			opacity: dimmed ? 0.4 : 1,
			strokeWidth: 1,
		}
	}

	// For skills that are ready to learn, show it in yellow, unless it's faded.
	if (readyToLearn) {
		return {
			borderColor: dimmed ? treeColors.faded : treeColors.ready,
			fillColor,
			opacity: dimmed ? 0.15 : 1,
			strokeWidth: 1,
		}
	}

	// For a skill that cannot be learned yet, fade it.
	return { borderColor: treeColors.faded, fillColor, opacity: 0.15, strokeWidth: 1 }
}
