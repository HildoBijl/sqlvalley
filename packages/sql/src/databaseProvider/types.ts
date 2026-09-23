import type { Database, QueryExecResult } from '@sqlvalley/sqljs'

// The format for the source argument that should be passed to the DatabaseProvider upon creating.
export interface DatabaseSource {
	tableKeys: readonly string[]
	datasetSizes?: readonly string[]
	buildCompletionSchema?: (tables: readonly string[]) => Record<string, string[]>
	buildSql: (options: { tables: string[]; size?: string }) => string
}

// A snapshot of the database and any initialization error.
export interface DatabaseSnapshot {
	database: Database | undefined
	error: Error | undefined
}

// A database handle with extra info/controls on a database.
export interface DatabaseHandle extends DatabaseSnapshot {
	loading: boolean
	reset: () => void
}

// The result of a query executed on a database.
export type QueryResult = QueryExecResult
