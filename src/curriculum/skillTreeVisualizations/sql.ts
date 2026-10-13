import { type ModuleGridPositions, defineModulePositioning } from '@sqlvalley/skill-tree'

import { moduleTree } from '../moduleDefinition'

// Define where each module sits on the grid.
const gridPositions: ModuleGridPositions = {
	// Fundamental database concepts.
	'database': [2.5, 1],
	'query-language': [2, 2],
	'database-table': [3, 2],
	'data-types': [3, 3],
	'database-keys': [5, 3],

	// Database table manipulation.
	'projection-and-filtering': [4, 3],
	'foreign-key': [5, 4],
	'join-and-decomposition': [5, 5],
	'aggregation': [6, 4],

	// SQL fundamentals.
	'sql': [2, 3],
	'choose-columns': [2.5, 4],
	'filter-rows': [3.5, 4],
	'write-single-criterion-query': [3, 5],

	// Single-table SQL querying.
	'sort-rows': [1, 5],
	'process-columns': [2, 5],
	'filter-rows-on-multiple-criteria': [4, 5],
	'write-multi-criterion-query': [2, 6],

	// Aggregation in SQL.
	'aggregate-columns': [6, 5],
	'use-filtered-aggregation': [5, 6],

	// Multi-table SQL querying.
	'write-look-up-query': [3, 6],
	'join-tables': [4, 6],
	'write-multi-table-query': [3.5, 7],
	'write-multi-layered-query': [3.5, 8],
}

const modulePositioning = defineModulePositioning(moduleTree, gridPositions)

export const sqlModulePositions = modulePositioning.modulePositions
export const sqlConnectors = modulePositioning.connectors
