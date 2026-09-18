export interface DatabaseSource {
	allTables: readonly string[]
	defaultSize: string
	buildSql: (options: { tables: string[]; size: string }) => string
	buildCompletionSchema: (tables: string[]) => Record<string, string[]>
}

export interface QueryResult {
	columns: string[]
	values: any[][]
}

export interface GetDatabaseOptions {
	// Whether the database should persist across page navigations
	persistent?: boolean
	metadata?: Record<string, unknown>
}

export interface ManagedDatabase {
	instance: any | null
	persistent: boolean
	createdAt: number | null
	metadata?: Record<string, unknown>
}
