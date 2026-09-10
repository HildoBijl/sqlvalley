import { type ColumnTypes, buildTableRows, parseCsv } from '../../parseCsv'

import type { TableDefinition } from '../types'

import fullCsv from './transactionsFull.csv?raw'
import smallCsv from './transactionsSmall.csv?raw'

const columns = {
  t_id: 'number',
  vendor: 'string',
  buyer: 'string',
  prod_id: 'number',
  date_time: 'date',
  price: 'number',
  validated_by: 'number',
  status: 'string',
} as const satisfies ColumnTypes

export const transactionsTable: TableDefinition = {
  name: 'transactions',
  columns,
  createTableSql: `CREATE TABLE transactions (
  t_id INTEGER PRIMARY KEY,
  vendor TEXT,
  buyer TEXT,
  prod_id INTEGER,
  date_time TEXT,
  price REAL,
  validated_by INTEGER,
  status TEXT,
  FOREIGN KEY (vendor) REFERENCES accounts(username),
  FOREIGN KEY (buyer) REFERENCES accounts(username),
  FOREIGN KEY (prod_id) REFERENCES products(p_id),
  FOREIGN KEY (validated_by) REFERENCES employees(e_id)
);`,
  rowsBySize: {
    full: buildTableRows(parseCsv(fullCsv), columns),
    small: buildTableRows(parseCsv(smallCsv), columns),
  },
}
