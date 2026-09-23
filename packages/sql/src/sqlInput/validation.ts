import type { Database } from '@sqlvalley/sqljs'
import { formatSqlErrorMessage, validateSqlInput } from '@sqlvalley/sql-grading'

import type { QueryResult } from '../databaseProvider'

export interface SqlQueryValidationReport {
	results: QueryResult[]
	query: string
}

interface SqlQueryValidationOptions {
	normalizedInput: unknown
	database: Database | undefined
	signal: AbortSignal
}

export async function validateSqlQuery({ normalizedInput, database, signal }: SqlQueryValidationOptions) {
	const query = typeof normalizedInput === 'string' ? normalizedInput : ''
	if (!query) return { valid: false as const }
	const syntax = validateSqlInput(query)
	if (!syntax.ok) return { valid: false as const, feedback: syntax.message }
	await new Promise(resolve => setTimeout(resolve, 150))
	if (signal.aborted) return { valid: false as const }
	try {
		if (!database) throw new Error('Database is not ready.')
		const results = database.exec(query)
		return { valid: true as const, report: { query, results } satisfies SqlQueryValidationReport }
	} catch (error) {
		return { valid: false as const, feedback: formatSqlErrorMessage(error instanceof Error ? error.message : String(error)) }
	}
}
