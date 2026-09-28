import type { Database, QueryExecResult } from '@sqlvalley/sqljs'

// Unlike SQL.js exec(), keep the column names of SELECTs that return no rows.
export function executeQuery(database: Database, query: string): QueryExecResult[] {
	const results: QueryExecResult[] = []
	const statements = database.iterateStatements(query)
	try {
		for (const statement of statements) {
			const result: QueryExecResult = { columns: statement.getColumnNames(), values: [] }
			while (statement.step()) result.values.push(statement.get())
			if (result.columns.length) results.push(result)
		}
	} finally {
		// The iterator frees its SQL buffer when exhausted, including after a step error.
		try {
			while (!statements.next().done) {
				// Advancing frees the previous statement without executing the next one.
			}
		} catch {
			// A prepare error also frees the iterator.
		}
	}
	return results
}
