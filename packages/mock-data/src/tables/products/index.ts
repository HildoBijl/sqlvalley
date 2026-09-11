import type { TableDefinition } from '../types'

import fullCsv from './productsFull.csv?raw'
import smallCsv from './productsSmall.csv?raw'

const columns = {
  p_id: 'number',
  name: 'string',
  category: 'string',
  owned_by: 'string',
  est_value: 'number',
  status: 'string',
} as const

const table: TableDefinition = {
  name: 'products',
  columns,
  createTableSql: `CREATE TABLE products (
  p_id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  owned_by TEXT,
  est_value REAL,
  status TEXT,
  FOREIGN KEY (owned_by) REFERENCES accounts(username)
);`,
  csvBySize: {
    full: fullCsv,
    small: smallCsv,
  },
}

export default table
