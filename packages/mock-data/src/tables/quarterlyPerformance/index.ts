import { type ColumnTypes, buildTableRows, parseCsv } from '../../parseCsv'

import type { TableDefinition } from '../types'

import fullCsv from './quarterlyPerformanceFull.csv?raw'
import smallCsv from './quarterlyPerformanceSmall.csv?raw'

const columns = {
  quarter: 'number',
  fiscal_year: 'number',
  revenue: 'number',
  operating_expenses: 'number',
  total_transactions: 'number',
  growth_rate: 'number',
  updated_at: 'date',
} as const satisfies ColumnTypes

export const quarterlyPerformanceTable: TableDefinition = {
  name: 'quarterly_performance',
  columns,
  createTableSql: `CREATE TABLE quarterly_performance (
  quarter INTEGER,
  fiscal_year INTEGER,
  revenue REAL,
  operating_expenses REAL,
  total_transactions INTEGER,
  growth_rate REAL,
  updated_at DATETIME,
  PRIMARY KEY (quarter, fiscal_year)
);`,
  rowsBySize: {
    full: buildTableRows(parseCsv(fullCsv), columns),
    small: buildTableRows(parseCsv(smallCsv), columns),
  },
}
