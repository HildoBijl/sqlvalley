import type { ColumnTypes } from '../parseCsv'

export const datasetSizes = ['full', 'small'] as const
export type DatasetSize = (typeof datasetSizes)[number]
export const defaultDatasetSize: DatasetSize = 'small'

export interface TableDefinition {
	name: string
	columns: ColumnTypes
	createTableSql: string
	csvBySize: Record<DatasetSize, string>
}
