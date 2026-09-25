import { type TableKey, allTableKeys } from '@sqlvalley/mock-data'
import { type TableIntroductions, buildTablesIntroducedByModule, getAvailableTableKeys as resolveAvailableTableKeys } from '@sqlvalley/sql-exercises'

import { type ModuleId, moduleTree } from './moduleDefinition'

// Tables become accessible at their introduction modules and in dependent modules.
const tableIntroductions: TableIntroductions<TableKey, ModuleId> = {
	// Company internals.
	departments: 'database',
	employees: 'query-language',
	contracts: 'sql',
	allocations: 'join-tables',

	// Financials.
	expenses: 'data-types',
	quarterlyPerformance: 'aggregation',

	// Sales.
	accounts: 'database-keys',
	products: 'join-and-decomposition',
	transactions: 'projection-and-filtering',
}

// Invert the table introductions to find which module introduces which tables.
export const tablesIntroducedByModule = buildTablesIntroducedByModule({ moduleTree, tableIntroductions, tableKeys: allTableKeys })

// Determine which module may access which tables.
export function getAvailableTableKeys(moduleId: string): TableKey[] {
	return resolveAvailableTableKeys({ moduleId, moduleTree, tablesIntroducedByModule })
}
