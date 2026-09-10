import { type ColumnTypes, buildTableRows, parseCsv } from '../../parseCsv'

import type { TableDefinition } from '../types'

import fullCsv from './employeesFull.csv?raw'
import smallCsv from './employeesSmall.csv?raw'

const columns = {
	e_id: 'number',
	first_name: 'string',
	last_name: 'string',
	phone: 'string',
	email: 'string',
	address: 'string',
	city: 'string',
	hire_date: 'date',
	current_salary: 'number',
} as const satisfies ColumnTypes

export const employeesTable: TableDefinition = {
	name: 'employees',
	columns,
	createTableSql: `CREATE TABLE employees (
  e_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  hire_date DATE,
  current_salary REAL
);`,
	rowsBySize: {
		full: buildTableRows(parseCsv(fullCsv), columns),
		small: buildTableRows(parseCsv(smallCsv), columns),
	},
}
