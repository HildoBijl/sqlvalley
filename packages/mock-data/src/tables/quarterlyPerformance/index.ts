import type { TableDefinition } from '../types'

import fullCsv from './quarterlyPerformanceFull.csv?raw'
import smallCsv from './quarterlyPerformanceSmall.csv?raw'

const columns = {
	quarter: 'string',
	fiscal_year: 'number',
	category: 'string',
	revenue: 'number',
	operating_expenses: 'number',
	total_transactions: 'number',
	updated_at: 'date',
} as const

const table: TableDefinition = {
	name: 'quarterly_performance',
	columns,
	createTableSql: `CREATE TABLE quarterly_performance (
  quarter TEXT,
  fiscal_year INTEGER,
  category TEXT,
  revenue REAL,
  operating_expenses REAL,
  total_transactions INTEGER,
  updated_at DATETIME,
  PRIMARY KEY (quarter, fiscal_year, category)
);`,
	csvBySize: {
		full: fullCsv,
		small: smallCsv,
	},
}

export default table
