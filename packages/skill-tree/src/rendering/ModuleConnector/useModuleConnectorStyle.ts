import { useTheme } from '@mui/material'

import type { ModuleConnector } from '../../positioning/index.ts'
import { useSkillTreeData } from '../../core/index.ts'
import { isConnectorInHighlightedPath, useSkillTreeInteraction } from '../../interaction/index.ts'
import { planningColors, useSkillTreePlanning } from '../../planning/index.ts'
import { isModuleReadyToLearn, progressColors, useSkillTreeProgress } from '../../progress/index.ts'

type ModuleConnectorReference = Pick<ModuleConnector, 'from' | 'to'>

interface ModuleConnectorStyle {
	strokeColor: string
	strokeWidth: number
	opacity: number
}

export function useModuleConnectorStyle(connector: ModuleConnectorReference): ModuleConnectorStyle {
	const theme = useTheme()
	const neutralColor = theme.palette.text.disabled

	// Derive module data.
	const { moduleTree } = useSkillTreeData()
	if (!moduleTree[connector.from]) throw new Error(`Unknown module "${connector.from}".`)
	if (!moduleTree[connector.to]) throw new Error(`Unknown module "${connector.to}".`)

	// Derive progress-related data.
	const { isModuleCompleted, isProgressTracked } = useSkillTreeProgress()
	const fromCompleted = isModuleCompleted(connector.from)
	const toCompleted = isModuleCompleted(connector.to)
	const bothCompleted = fromCompleted && toCompleted
	const isNextToLearn = isModuleReadyToLearn(moduleTree, connector.to, isModuleCompleted) && fromCompleted

	// Derive interaction-related data.
	const { highlightedModuleId, highlightedPrerequisiteIds } = useSkillTreeInteraction()
	const isInHighlightedPath = isConnectorInHighlightedPath(connector, highlightedModuleId, highlightedPrerequisiteIds)
	const isSomethingHighlighted = highlightedModuleId !== null

	// Derive planning-mode-related data.
	const { isPlanningModeActive, goalModuleId, goalPathModuleIds } = useSkillTreePlanning()
	const isInGoalPath = isPlanningModeActive && goalModuleId && goalPathModuleIds.has(connector.from) && goalPathModuleIds.has(connector.to)

	// When neither planning nor progress data is available, give a static style.
	if (!isProgressTracked && !isPlanningModeActive) return { strokeColor: neutralColor, strokeWidth: 1.5, opacity: 1 }

	// Highlight connectors within the highlighted module's prerequisite path.
	if (isInHighlightedPath) {
		if (bothCompleted) return { strokeColor: progressColors.completed, strokeWidth: 1.5, opacity: 0.7 }
		if (isNextToLearn) return { strokeColor: progressColors.ready, strokeWidth: 1.5, opacity: 0.7 }
		return { strokeColor: progressColors.locked, strokeWidth: 1.5, opacity: 0.7 }
	}

	// Fade all other connectors when a module is highlighted.
	if (isSomethingHighlighted) return { strokeColor: neutralColor, strokeWidth: 1.5, opacity: isPlanningModeActive ? 0.15 : 0.2 }

	// When the planning mode is on, emphasize the selected goal path.
	if (isPlanningModeActive) {
		if (!goalModuleId) return { strokeColor: neutralColor, strokeWidth: 1.5, opacity: 0.7 }
		if (!isInGoalPath) return { strokeColor: neutralColor, strokeWidth: 1.5, opacity: 0.15 }
		if (bothCompleted) return { strokeColor: progressColors.completed, strokeWidth: 1.5, opacity: 1 }
		if (isNextToLearn) return { strokeColor: progressColors.ready, strokeWidth: 1.5, opacity: 1 }
		return { strokeColor: planningColors.goal, strokeWidth: 1.5, opacity: 1 }
	}

	// Outside planning mode, show normal progress styling.
	if (bothCompleted) return { strokeColor: progressColors.completed, strokeWidth: 1.5, opacity: 0.7 }
	if (isNextToLearn) return { strokeColor: progressColors.ready, strokeWidth: 1.5, opacity: 0.5 }
	return { strokeColor: neutralColor, strokeWidth: 1.5, opacity: 0.2 }
}
