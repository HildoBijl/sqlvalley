import type { ColumnTypes } from '../../parseCsv'
import type { TableDefinition } from '../types'
import { buildTableRows, parseCsv } from '../../parseCsv'

import fullCsv from './accountsFull.csv?raw'
import smallCsv from './accountsSmall.csv?raw'

const columns = {
  username: 'string',
  phone: 'string',
  email: 'string',
  email_verified: 'boolean',
  first_name: 'string',
  last_name: "string",
  address: 'string',
  city: 'string',
  created_at: 'date',
  last_login_at: 'date',
} as const satisfies ColumnTypes

export const accountsTable: TableDefinition = {
  name: 'accounts',
  columns,
  createTableSql: `CREATE TABLE accounts (
  username TEXT PRIMARY KEY,
  phone TEXT,
  email TEXT,
  email_verified BOOLEAN,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  city TEXT,
  created_at TEXT,
  last_login_at TEXT
);`,
  rowsBySize: {
    full: buildTableRows(parseCsv(fullCsv), columns),
    small: buildTableRows(parseCsv(smallCsv), columns),
  },
}
