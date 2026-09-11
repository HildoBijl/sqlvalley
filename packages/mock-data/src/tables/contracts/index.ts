import type { TableDefinition } from '../types'

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
} as const

const table: TableDefinition = {
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
  csvBySize: {
    full: fullCsv,
    small: smallCsv,
  },
}

export default table
