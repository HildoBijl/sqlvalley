import { type ModuleGridPositions, defineModulePositioning } from '@sqlvalley/skill-tree'

import { moduleTree } from '../moduleDefinition'

// Define where each module sits on the grid.
const gridPositions: ModuleGridPositions = {
	// Fundamental database concepts (shared with SQL tree).
	'database': [3, 1],
	'query-language': [2, 2],
	'database-table': [3, 2],
	'database-keys': [4, 3],

	// Database table manipulation concepts.
	'projection-and-filtering': [3, 3],
	'foreign-key': [4, 4],
	'join-and-decomposition': [4, 5],

	// RA fundamentals.
	'relational-algebra': [2, 3],

	// RA-specific skills.
	'ra-choose-columns': [2, 4.5],
	'ra-filter-rows': [3, 4.5],
	'ra-set-up-single-relation-query': [2, 6],
	'ra-join-relations': [3, 6],
	'ra-set-up-multi-condition-query': [2, 7],
	'ra-set-up-multi-relation-query': [3, 7],
	'ra-set-up-universal-condition-query': [2.5, 9],
	'ra-set-up-multi-step-query': [2.5, 8],
}

const modulePositioning = defineModulePositioning(moduleTree, gridPositions)

export const raModulePositions = modulePositioning.modulePositions
export const raConnectors = modulePositioning.connectors
