import { useCallback } from 'react'

import type { Database } from '@sqlvalley/sqljs'
import type { QueryResult } from '@sqlvalley/sql'

import { useCurrentUserExerciseDatabase } from '../../exerciseContext'

import { isSqlInputValue, interpretSqlInputValue } from '../valueTypes'

import { formatSqlErrorMessage } from './formatting'

interface SqlQueryValidationOptions {
	inputValue: unknown
	database: Database | undefined
	signal: AbortSignal
}

export interface SqlQueryValidationReport {
	results: QueryResult[]
	query: string
}

// Check a given query by running it on a sample database and seeing if an error occurs.
export async function validateSqlQuery({ inputValue, database, signal }: SqlQueryValidationOptions) {
	// Check if it's something we can run.
	if (!isSqlInputValue(inputValue) || !inputValue.value) return { valid: false as const }
	const query = interpretSqlInputValue(inputValue)
	const syntax = validateSqlInput(query)
	if (!syntax.valid) return { valid: false as const, feedback: syntax.message }

	// Only run the query for validation if the input hasn't changed in a certain time. This is to prevent app from stalling on every keystroke.
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

// Check only the form of the input. Reject clearly invalid ones early on.
export function validateSqlInput(query: string) {
	if (!query.trim()) return { valid: false as const, message: 'Please enter a valid SQL SELECT query so we can check it.' }
	if (!/\b(select|with)\b/i.test(query)) return { valid: false as const, message: 'Start with a SELECT (or WITH) clause so we can understand the query.' }
	return { valid: true as const }
}

// A hook that loads in the databases and gives a stable validation function that uses said database.
export function useSqlQueryValidation() {
	const databaseHandle = useCurrentUserExerciseDatabase()
	return useCallback(({ normalizedInput, signal }: { normalizedInput: unknown; signal: AbortSignal }) => validateSqlQuery({ inputValue: normalizedInput, signal, database: databaseHandle.database }), [databaseHandle.database])
}
