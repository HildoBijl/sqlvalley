import type { TableDefinition, Attributes } from '../../types';
import { parseCsv, buildRows } from '../../utils';

import fullCsv from './ref.csv?raw';
import smallCsv from './quarterlyPerformanceSmall.csv?raw';

const attributes = {
  quarter: 'string',
  fiscal_year: 'number',
  category: 'string',
  revenue: 'number',
  operating_expenses: 'number',
  total_transactions: 'number',
  updated_at: 'date',
} as const satisfies Attributes;

export const quarterlyPerformanceTable: TableDefinition = {
  name: 'quarterly_performance',
  attributes,
  createStatement: `CREATE TABLE quarterly_performance (
  quarter TEXT,
  fiscal_year INTEGER,
  category TEXT,
  revenue REAL,
  operating_expenses REAL,
  total_transactions INTEGER,
  updated_at DATETIME,
  PRIMARY KEY (quarter, fiscal_year, category)
);`,
  rows: {
    full: buildRows(parseCsv(fullCsv), attributes),
    small: buildRows(parseCsv(smallCsv), attributes),
  },
};
