import type { ColumnTypes, ColumnValue } from '../parseCsv'

// Table definition with full and small row sets.
export interface TableDefinition {
	name: string // Table name in the database.
	columns: ColumnTypes
	createTableSql: string
	rowsBySize: {
		full: ColumnValue[][]
		small: ColumnValue[][]
	}
}

export type DatasetSize = keyof TableDefinition['rowsBySize']
export const defaultDatasetSize: DatasetSize = 'small'
