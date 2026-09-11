import type { TableDefinition } from '../types'

import fullCsv from './accountsFull.csv?raw'
import smallCsv from './accountsSmall.csv?raw'

const columns = {
	username: 'string',
	phone: 'string',
	email: 'string',
	email_verified: 'boolean',
	first_name: 'string',
	last_name: 'string',
	address: 'string',
	city: 'string',
	created_at: 'date',
	last_login_at: 'date',
} as const

const table: TableDefinition = {
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
	csvBySize: {
		full: fullCsv,
		small: smallCsv,
	},
}

export default table
