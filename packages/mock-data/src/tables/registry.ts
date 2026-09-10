import type { TableDefinition } from './types'

import { accountsTable } from './accounts'
import { allocationsTable } from './allocations'
import { contractsTable } from './contracts'
import { departmentsTable } from './departments'
import { employeesTable } from './employees'
import { expensesTable } from './expenses'
import { productsTable } from './products'
import { quarterlyPerformanceTable } from './quarterlyPerformance'
import { transactionsTable } from './transactions'

export const tableRegistry = {
	// Company internals.
	departments: departmentsTable,
	employees: employeesTable,
	contracts: contractsTable,
	allocations: allocationsTable,

	// Financials.
	expenses: expensesTable,
	quarterlyPerformance: quarterlyPerformanceTable,

	// Sales.
	accounts: accountsTable,
	products: productsTable,
	transactions: transactionsTable,
} satisfies Record<string, TableDefinition>

export type TableKey = keyof typeof tableRegistry
export const allTableKeys = Object.keys(tableRegistry) as TableKey[]
