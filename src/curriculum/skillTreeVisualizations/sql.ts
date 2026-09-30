import { type GridPosition, type ModulePositionMeta, defineSkillTree } from '@sqlvalley/skill-tree'

import { moduleTree } from '../moduleDefinition'

// Where each module sits on the grid. Cells are 1-indexed, and fractional values place a module between two cells.
const nodes: Record<string, GridPosition> = {
	// Fundamental database concepts.
	'database': { col: 2.5, row: 1 },
	'query-language': { col: 2, row: 2 },
	'database-table': { col: 3, row: 2 },
	'data-types': { col: 3, row: 3 },
	'database-keys': { col: 5, row: 3 },

	// Database table manipulation.
	'projection-and-filtering': { col: 4, row: 3 },
	'foreign-key': { col: 5, row: 4 },
	'join-and-decomposition': { col: 5, row: 5 },
	'aggregation': { col: 6, row: 4 },

	// SQL fundamentals.
	'sql': { col: 2, row: 3 },
	'choose-columns': { col: 2.5, row: 4 },
	'filter-rows': { col: 3.5, row: 4 },
	'write-single-criterion-query': { col: 3, row: 5 },

	// Single-table SQL querying.
	'sort-rows': { col: 1, row: 5 },
	'process-columns': { col: 2, row: 5 },
	'filter-rows-on-multiple-criteria': { col: 4, row: 5 },
	'write-multi-criterion-query': { col: 2, row: 6 },

	// Aggregation in SQL.
	'aggregate-columns': { col: 6, row: 5 },
	'use-filtered-aggregation': { col: 5, row: 6 },

	// Multi-table SQL querying.
	'write-look-up-query': { col: 3, row: 6 },
	'join-tables': { col: 4, row: 6 },
	'write-multi-table-query': { col: 3.5, row: 7 },
	'write-multi-layered-query': { col: 3.5, row: 8 },
}

const processedModulePositions = defineSkillTree({
	name: 'Skill Tree',
	moduleTree,
	nodes,
})

export const sqlModulePositions: Record<string, ModulePositionMeta> = processedModulePositions.modulePositions
export const sqlConnectors = processedModulePositions.connectors
