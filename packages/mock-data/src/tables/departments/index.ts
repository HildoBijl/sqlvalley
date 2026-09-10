import type { ColumnTypes } from '../../parseCsv'
import type { TableDefinition } from '../types'
import { buildTableRows, parseCsv } from '../../parseCsv'

import fullCsv from './departmentsFull.csv?raw'
import smallCsv from './departmentsSmall.csv?raw'

const columns = {
  d_id: 'number',
  d_name: 'string',
  manager_id: 'number',
  budget: 'number',
  nr_employees: 'number',
} as const satisfies ColumnTypes

export const departmentsTable: TableDefinition = {
  name: 'departments',
  columns,
  createTableSql: `CREATE TABLE departments (
  d_id INTEGER PRIMARY KEY,
  d_name TEXT NOT NULL,
  manager_id INTEGER,
  budget REAL,
  nr_employees INTEGER,
  FOREIGN KEY (manager_id) REFERENCES employees(e_id)
);`,
  rowsBySize: {
    full: buildTableRows(parseCsv(fullCsv), columns),
    small: buildTableRows(parseCsv(smallCsv), columns),
  },
}
