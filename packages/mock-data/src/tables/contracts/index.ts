import type { ColumnTypes } from '../../parseCsv'
import type { TableDefinition } from '../types'
import { buildTableRows, parseCsv } from '../../parseCsv'

import fullCsv from './contractsFull.csv?raw'
import smallCsv from './contractsSmall.csv?raw'

const columns = {
  e_id: 'number',
  position: 'string',
  salary: 'number',
  start_date: 'date',
  end_date: 'date',
  perf_score: 'number',
  status: 'string',
} as const satisfies ColumnTypes

export const contractsTable: TableDefinition = {
  name: 'contracts',
  columns,
  createTableSql: `CREATE TABLE contracts (
  e_id INTEGER NOT NULL,
  position TEXT,
  salary REAL,
  start_date TEXT,
  end_date TEXT,
  perf_score INTEGER,
  status TEXT,
  FOREIGN KEY (e_id) REFERENCES employees(e_id)
);`,
  rowsBySize: {
    full: buildTableRows(parseCsv(fullCsv), columns),
    small: buildTableRows(parseCsv(smallCsv), columns),
  },
}
