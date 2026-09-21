import { type TableKey, allTableKeys } from '@sqlvalley/mock-data'
import { type TableIntroductions, buildModuleAccess, getModuleTableKeys as resolveModuleTableKeys } from '@sqlvalley/sql'

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
export const moduleAccess = buildModuleAccess({ moduleTree, tableIntroductions, tableKeys: allTableKeys })

// Determine which module may access which tables.
export function getModuleTableKeys(moduleId: string): TableKey[] {
	return resolveModuleTableKeys({ moduleId, moduleTree, moduleAccess })
}
