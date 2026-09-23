import { useCallback } from 'react'

import type { Database } from '@sqlvalley/sqljs'
import { formatSqlErrorMessage, validateSqlInput } from '@sqlvalley/sql-grading'

import type { QueryResult } from '../databaseProvider'
import { useCurrentUserModuleDatabase } from '../sqlModuleProvider'

export interface SqlQueryValidationReport {
	results: QueryResult[]
	query: string
}

interface SqlQueryValidationOptions {
	normalizedInput: unknown
	database: Database | undefined
	signal: AbortSignal
}

export async function validateSqlQuery({ normalizedInput: query, database, signal }: SqlQueryValidationOptions) {
	// Check if it's something we can run.
	if (typeof query !== 'string') return { valid: false as const }
	const syntax = validateSqlInput(query)
	if (!syntax.ok) return { valid: false as const, feedback: syntax.message }

	// Only run validation if the input hasn't changed in a certain time.
	await new Promise(resolve => setTimeout(resolve, 150))
	if (signal.aborted) return { valid: false as const }

	// Run the query and check the output.
	try {
		if (!database) throw new Error('Database is not ready.')
		const results = database.exec(query)
		return { valid: true as const, report: { query, results } satisfies SqlQueryValidationReport }
	} catch (error) {
		return { valid: false as const, feedback: formatSqlErrorMessage(error instanceof Error ? error.message : String(error)) }
	}
}

export function useSqlQueryValidation() {
	const selected = useCurrentUserModuleDatabase()
	return useCallback(({ normalizedInput, signal }: { normalizedInput: unknown; signal: AbortSignal }) =>
		validateSqlQuery({ normalizedInput, signal, database: selected.database }),
	[selected.database])
}
