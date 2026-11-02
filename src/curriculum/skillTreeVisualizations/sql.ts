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
	'sort-and-limit-rows': [1, 5],
	'process-columns': [2, 5],
	'filter-rows-on-multiple-criteria': [4, 5],
	'write-single-table-query': [2, 6],

	// Aggregation in SQL.
	'aggregate-columns': [6, 5],
	'write-filtered-aggregation-query': [5, 6],

	// Multi-table SQL querying.
	'write-lookup-query': [3, 6],
	'join-tables': [4, 6],
	'write-multi-table-query': [3.5, 7],
	'write-multi-step-query': [3.5, 8],
}

export const sqlModulePositioning = defineModulePositioning(moduleTree, gridPositions)
