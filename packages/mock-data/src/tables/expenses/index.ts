import { type ColumnTypes, buildTableRows, parseCsv } from '../../parseCsv'

import type { TableDefinition } from '../types'

import fullCsv from './expensesFull.csv?raw'
import smallCsv from './expensesSmall.csv?raw'

const columns = {
  exp_id: 'number',
  amount: 'number',
  d_id: 'number',
  description: 'string',
  date: 'date',
  requested_by: 'number',
  approved_by: 'number',
} as const satisfies ColumnTypes

export const expensesTable: TableDefinition = {
  name: 'expenses',
  columns,
  createTableSql: `CREATE TABLE expenses (
  exp_id INTEGER PRIMARY KEY,
  amount REAL,
  d_id INTEGER,
  description TEXT,
  date TEXT,
  requested_by INTEGER,
  approved_by INTEGER,
  FOREIGN KEY (d_id) REFERENCES departments(d_id),
  FOREIGN KEY (requested_by) REFERENCES employees(e_id),
  FOREIGN KEY (approved_by) REFERENCES employees(e_id)
);`,
  rowsBySize: {
    full: buildTableRows(parseCsv(fullCsv), columns),
    small: buildTableRows(parseCsv(smallCsv), columns),
  },
}
