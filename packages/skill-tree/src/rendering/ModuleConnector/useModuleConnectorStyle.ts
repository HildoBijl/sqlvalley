import { isReadyToLearn } from '@sqlvalley/progress'

import type { ModuleConnector } from '../../positioning'
import { treeColors } from '../../styles'
import { useSkillTreeData } from '../../core'
import { useSkillTreeProgress } from '../../progress'
import { isConnectorInHoveredPath, useSkillTreeInteraction } from '../../interaction'
import { useSkillTreePlanning } from '../../planning'

type ModuleConnectorReference = Pick<ModuleConnector, 'from' | 'to'>

interface ModuleConnectorStyle {
	strokeColor: string
	strokeWidth: number
	opacity: number
}

export function useModuleConnectorStyle(connector: ModuleConnectorReference): ModuleConnectorStyle {
	// Derive module data.
	const { moduleTree } = useSkillTreeData()
	if (!moduleTree[connector.from]) throw new Error(`Unknown module "${connector.from}".`)
	if (!moduleTree[connector.to]) throw new Error(`Unknown module "${connector.to}".`)

	// Derive progress-related data.
	const { isCompleted, hasProgress } = useSkillTreeProgress()
	const fromCompleted = isCompleted(connector.from)
	const toCompleted = isCompleted(connector.to)
	const bothCompleted = fromCompleted && toCompleted
	const isNextToLearn = isReadyToLearn(moduleTree, connector.to, isCompleted) && fromCompleted

	// Derive interaction-related data.
	const { hoveredModuleId, hoveredPrerequisiteIds } = useSkillTreeInteraction()
	const isInHoveredPath = isConnectorInHoveredPath(connector, hoveredModuleId, hoveredPrerequisiteIds)
	const isSomethingHovered = hoveredModuleId !== null

	// Derive planning-mode-related data.
	const { planningMode, goalModuleId, goalPath } = useSkillTreePlanning()
	const isInGoalPath = planningMode && goalModuleId && goalPath.has(connector.from) && goalPath.has(connector.to)

	// When no progress data is available, give a static style.
	if (!hasProgress) return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 1 }

	// Highlight connectors within the hovered module's prerequisite path.
	if (isInHoveredPath) {
		if (bothCompleted) return { strokeColor: treeColors.completed, strokeWidth: 1.5, opacity: 0.7 }
		if (isNextToLearn) return { strokeColor: treeColors.ready, strokeWidth: 1.5, opacity: 0.7 }
		return { strokeColor: treeColors.locked, strokeWidth: 1.5, opacity: 0.7 }
	}

	// Fade all other connectors when a module is hovered.
	if (isSomethingHovered) return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: planningMode ? 0.15 : 0.2 }

	// When the planning mode is on, emphasize the selected goal path.
	if (planningMode) {
		if (!goalModuleId) return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 0.7 }
		if (!isInGoalPath) return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 0.15 }
		if (bothCompleted) return { strokeColor: treeColors.completed, strokeWidth: 1.5, opacity: 1 }
		if (isNextToLearn) return { strokeColor: treeColors.ready, strokeWidth: 1.5, opacity: 1 }
		return { strokeColor: treeColors.goal, strokeWidth: 1.5, opacity: 1 }
	}

	// Outside planning mode, show normal progress styling.
	if (bothCompleted) return { strokeColor: treeColors.completed, strokeWidth: 1.5, opacity: 0.7 }
	if (isNextToLearn) return { strokeColor: treeColors.ready, strokeWidth: 1.5, opacity: 0.5 }
	return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 0.2 }
}
