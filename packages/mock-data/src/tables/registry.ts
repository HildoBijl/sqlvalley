import type { TableDefinition } from './types'

import departments from './departments'
import employees from './employees'
import contracts from './contracts'
import allocations from './allocations'

import expenses from './expenses'
import quarterlyPerformance from './quarterlyPerformance'

import accounts from './accounts'
import products from './products'
import transactions from './transactions'

export const tableRegistry = {
	// Company internals.
	departments,
	employees,
	contracts,
	allocations,

	// Financials.
	expenses,
	quarterlyPerformance,

	// Sales.
	accounts,
	products,
	transactions,
} satisfies Record<string, TableDefinition>

export type TableKey = keyof typeof tableRegistry
export const allTableKeys = Object.keys(tableRegistry) as TableKey[]
