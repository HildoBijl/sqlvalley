import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'

import { isReadyToLearn } from '@sqlvalley/progress'

import type { ModuleConnector } from '../positioning'

import { treeColors } from './treeColors'

type ConnectorReference = Pick<ModuleConnector, 'from' | 'to'>

export function isConnectorInGoalPath(
	connector: ConnectorReference,
	planningMode: boolean,
	goalModuleId: ModuleId | null,
	goalPath: Set<ModuleId>,
): boolean {
	if (!planningMode || !goalModuleId) return false
	return goalPath.has(connector.from) && goalPath.has(connector.to)
}

export function resolveConnectorStyle(
	connector: ConnectorReference,
	planningMode: boolean,
	goalModuleId: ModuleId | null,
	goalPath: Set<ModuleId>,
	hoveredModuleId: ModuleId | null,
	isCompletedFn: (id: ModuleId) => boolean,
	moduleTree: ModuleTree,
	isInHoveredPath: boolean,
	staticMode?: boolean,
) {
	const fromCompleted = isCompletedFn(connector.from)
	return getConnectorStyle({
		planningMode,
		goalModuleId,
		isInGoalPath: isConnectorInGoalPath(connector, planningMode, goalModuleId, goalPath),
		isInHoveredPath,
		isSomethingHovered: !!hoveredModuleId,
		fromCompleted,
		toCompleted: isCompletedFn(connector.to),
		isNextToLearn: isReadyToLearn(moduleTree, connector.to, isCompletedFn) && fromCompleted,
		staticMode,
	})
}

interface ConnectorStyleInput {
	planningMode: boolean
	goalModuleId: ModuleId | null
	isInGoalPath: boolean
	isInHoveredPath: boolean
	isSomethingHovered: boolean
	fromCompleted: boolean
	toCompleted: boolean
	isNextToLearn: boolean
	staticMode?: boolean
}

interface ConnectorStyleOutput {
	strokeColor: string
	strokeWidth: number
	opacity: number
}

export function getConnectorStyle({
	planningMode,
	goalModuleId,
	isInGoalPath,
	isInHoveredPath,
	isSomethingHovered,
	fromCompleted,
	toCompleted,
	isNextToLearn,
	staticMode,
}: ConnectorStyleInput): ConnectorStyleOutput {
	const bothCompleted = fromCompleted && toCompleted

	if (staticMode) {
		return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 1 }
	}

	if (isInHoveredPath) {
		if (bothCompleted) {
			return { strokeColor: treeColors.completed, strokeWidth: 1.5, opacity: 0.7 }
		}
		if (isNextToLearn) {
			return { strokeColor: treeColors.ready, strokeWidth: 1.5, opacity: 0.7 }
		}
		return { strokeColor: treeColors.locked, strokeWidth: 1.5, opacity: 0.7 }
	}

	if (isSomethingHovered) {
		return {
			strokeColor: treeColors.neutral,
			strokeWidth: 1.5,
			opacity: planningMode ? 0.15 : 0.2,
		}
	}

	if (planningMode) {
		if (!goalModuleId) {
			return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 0.7 }
		}
		if (!isInGoalPath) {
			return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 0.15 }
		}
		if (bothCompleted) {
			return { strokeColor: treeColors.completed, strokeWidth: 1.5, opacity: 1 }
		}
		if (isNextToLearn) {
			return { strokeColor: treeColors.ready, strokeWidth: 1.5, opacity: 1 }
		}
		return { strokeColor: treeColors.goal, strokeWidth: 1.5, opacity: 1 }
	}

	if (bothCompleted) {
		return { strokeColor: treeColors.completed, strokeWidth: 1.5, opacity: 0.7 }
	}
	if (isNextToLearn) {
		return { strokeColor: treeColors.ready, strokeWidth: 1.5, opacity: 0.5 }
	}
	return { strokeColor: treeColors.neutral, strokeWidth: 1.5, opacity: 0.2 }
}
