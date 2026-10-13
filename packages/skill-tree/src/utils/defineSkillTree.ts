import type { ModuleTree } from '@step-wise/module-tree-definition'
import { computeConnectorPath } from './graphics/pathCalculations'
import { type GridPosition, gridToPixels } from './gridLayout'
import { type ModulePositionMetaRaw, type ProcessedModulePositions, processModulePositions } from './positionProcessing'
import { cardHeight } from './settings'

export interface SkillTreeDefinitionOptions {
	// The display name of the tree, used in error messages.
	name: string
	moduleTree: ModuleTree
	// The modules shown in this tree, mapped to the grid cell they sit on.
	// A module is part of this tree exactly when its ID appears here.
	nodes: Record<string, GridPosition>
}

// Add drawing positions and connector paths to modules assigned to grid cells.
export function defineSkillTree({ name, moduleTree, nodes }: SkillTreeDefinitionOptions): ProcessedModulePositions {
	const rawPositions: Record<string, ModulePositionMetaRaw> = {}
	Object.entries(nodes).forEach(([id, cell]) => {
		rawPositions[id] = { position: gridToPixels(cell) }
	})

	return processModulePositions({
		rawPositions,
		moduleTree,
		cardHeight,
		computeConnectorPath,
		treeName: name,
	})
}
