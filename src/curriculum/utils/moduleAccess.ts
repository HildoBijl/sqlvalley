import { type TableKey, allTableKeys } from '@sqlvalley/mock-data'
import { type ModuleAccess, getModuleTableKeys as resolveModuleTableKeys } from '@sqlvalley/sql'

import { type ModuleId, moduleTree } from '../moduleDefinition'

// Tables become accessible at their introduction modules and in dependent modules.
export const moduleAccess: ModuleAccess<TableKey, ModuleId> = {
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

// Return accessible table keys, including prerequisite tables. Unknown modules throw.
export function getModuleTableKeys(moduleId: string): TableKey[] {
	return resolveModuleTableKeys({ moduleId, moduleTree, moduleAccess, tableKeys: allTableKeys })
}
