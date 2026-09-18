import type { ModuleTree } from '@step-wise/module-tree-definition'
import { computeConnectorPath } from './graphics/pathCalculations';
import { type GridPosition, gridToPixels } from './gridLayout';
import {
	type ModulePositionMetaRaw,
	type ProcessedModulePositions,
	processModulePositions,
} from './positionProcessing';
import { cardHeight } from './settings';

export interface SkillTreeDefinitionOptions {
	// The display name of the tree, used in error messages.
	name: string;
	moduleTree: ModuleTree;
	// The modules shown in this tree, mapped to the grid cell they sit on.
	// A module is part of this tree exactly when its ID appears here.
	nodes: Record<string, GridPosition>;
}

/*
 * Build the layout of a single skill tree from a map of grid cells.
 *
 * This is the entry point for defining a tree: it converts each cell to pixel
 * coordinates and works out the connectors between modules, so a tree
 * definition never has to deal with card sizes or path geometry itself.
 *
 * @param options: The tree name, the skill tree it draws from, and the grid cell per module.
 * @returns The positioned modules and the connectors between them.
 */
export function defineSkillTree({
	name,
	moduleTree,
	nodes,
}: SkillTreeDefinitionOptions): ProcessedModulePositions {
	const rawPositions: Record<string, ModulePositionMetaRaw> = {};
	Object.entries(nodes).forEach(([id, cell]) => {
		rawPositions[id] = { position: gridToPixels(cell) };
	});

	return processModulePositions({
		rawPositions,
		moduleTree,
		cardHeight,
		computeConnectorPath,
		treeName: name,
	});
}
