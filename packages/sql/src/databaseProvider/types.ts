import type { Database, QueryExecResult } from '@sqlvalley/sqljs'

export interface DatabaseSource {
	tableKeys: readonly string[]
	datasetSizes?: readonly string[]
	buildSql: (options: { tables: string[]; size?: string }) => string
}

export interface DatabaseOptions {
	key?: string
	tables?: readonly string[]
	size?: string
}

export interface DatabaseHandle {
	database: Database | undefined
	loading: boolean
	error: Error | undefined
	reset: () => void
}

export type QueryResult = QueryExecResult
