import { type ModuleGridPositions, defineModulePositioning } from '@sqlvalley/skill-tree'

import { moduleTree } from '../moduleDefinition'

// Define where each module sits on the grid.
const gridPositions: ModuleGridPositions = {
	// Fundamental database concepts (shared with SQL and RA tree).
	'database': [3, 1],
	'database-table': [2.5, 2],
	'query-language': [3.5, 2],
	'projection-and-filtering': [2, 3],
	'database-keys': [3, 3],

	'database-view': [2, 4],
	'foreign-key': [3, 4],
	'datalog': [2, 5],
	'join-and-decomposition': [3, 5],
	'recursive-query': [4, 5],

	// Datalog concepts
	'dl-define-projection-rule': [1, 6],
	'dl-define-filtering-rule': [2, 6],
	'dl-define-derived-predicate': [1, 7],
	'dl-define-join-rule': [2, 7],

	// Datalog with negation
	'dl-literal-types-and-rule-safety': [3, 6],
	'dl-define-negation-rule': [2.5, 8],
	'dl-check-rule-safety': [3, 7],
	'dl-write-multi-predicate-program': [2, 9],

	// Recursive Datalog
	'dl-predicate-dependency-graph': [4.5, 6],
	'dl-draw-predicate-dependency-graph': [4, 7],
	'dl-semi-positive-and-stratified-datalog': [5, 7],
	'dl-check-program-stratification': [4.5, 8],
	'dl-define-recursive-predicate': [3.5, 8],
	'dl-write-recursive-program': [3, 10],
}

export const datalogModulePositioning = defineModulePositioning(moduleTree, gridPositions)
