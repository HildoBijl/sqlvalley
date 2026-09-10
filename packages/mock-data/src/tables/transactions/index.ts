import type { TableDefinition, Attributes } from '../../types'
import { parseCsv, buildRows } from '../../utils'

import fullCsv from './transactionsFull.csv?raw'
import smallCsv from './transactionsSmall.csv?raw'

const attributes = {
  t_id: 'number',
  vendor: 'string',
  buyer: 'string',
  prod_id: 'number',
  date_time: 'date',
  price: 'number',
  validated_by: 'number',
  status: 'string',
} as const satisfies Attributes

export const transactionsTable: TableDefinition = {
  name: 'transactions',
  attributes,
  createStatement: `CREATE TABLE transactions (
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
  rows: {
    full: buildRows(parseCsv(fullCsv), attributes),
    small: buildRows(parseCsv(smallCsv), attributes),
  },
}
