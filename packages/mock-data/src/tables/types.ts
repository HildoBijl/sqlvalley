import type { ColumnTypes } from '../parseCsv'

export interface TableDefinition {
	name: string
	columns: ColumnTypes
	createTableSql: string
	csvBySize: {
		full: string
		small: string
	}
}

export type DatasetSize = keyof TableDefinition['csvBySize']
export const defaultDatasetSize: DatasetSize = 'small'
