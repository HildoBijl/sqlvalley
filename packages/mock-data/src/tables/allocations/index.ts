import type { TableDefinition } from '../types'

import fullCsv from './allocationsFull.csv?raw'
import smallCsv from './allocationsSmall.csv?raw'

const columns = {
  e_id: 'number',
  d_id: 'number',
} as const

const table: TableDefinition = {
  name: 'allocations',
  columns,
  createTableSql: `CREATE TABLE allocations (
  e_id INTEGER NOT NULL,
  d_id INTEGER NOT NULL,
  PRIMARY KEY (e_id, d_id),
  FOREIGN KEY (e_id) REFERENCES employees(e_id),
  FOREIGN KEY (d_id) REFERENCES departments(d_id)
);`,
  csvBySize: {
    full: fullCsv,
    small: smallCsv,
  },
}

export default table
