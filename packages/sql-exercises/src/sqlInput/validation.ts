import { useCallback } from 'react'

import type { QueryResult } from '@sqlvalley/sql'
import type { Database } from '@sqlvalley/sqljs'

import { useCurrentUserExerciseDatabase } from '../exerciseContext'
import { isSqlInputValue, interpretSqlInputValue } from './valueTypes'

const SQL_ERROR_PATTERNS: Array<{ pattern: RegExp; format: (match: RegExpMatchArray) => string }> = [
	{ pattern: /no such column:\s*("?)([^"\s]+)\1/i, format: match => `Did not recognize column "${match[2]}". Check spelling or table schema.` },
	{ pattern: /no such table:\s*("?)([^"\s]+)\1/i, format: match => `Did not recognize table "${match[2]}".` },
	{ pattern: /no such function:\s*("?)([^"\s]+)\1/i, format: match => `Did not recognize function "${match[2]}".` },
	{ pattern: /ambiguous column name:\s*("?)([^"\s]+)\1/i, format: match => `Column name "${match[2]}" is ambiguous (appears in more than one table).` },
	{ pattern: /table\s+("?)([^"\s]+)\1\s+has no column named\s+("?)([^"\s]+)\3/i, format: match => `Table "${match[2]}" has no column named "${match[4]}".` },
	{ pattern: /misuse of aggregate(?: function)?:\s*([A-Za-z0-9_]+)\s*\(?/i, format: match => `Misuse of aggregate function "${match[1]}".` },
	{ pattern: /near\s+"([^"]+)":\s*syntax error/i, format: match => `Syntax error near "${match[1]}".` },
	{ pattern: /incomplete input/i, format: () => 'Syntax error: incomplete input.' },
]

export function validateSqlInput(query: string) {
	if (!query.trim()) return { valid: false as const, message: 'Please enter a valid SQL SELECT query so we can check it.' }
	if (!/\b(select|with)\b/i.test(query)) return { valid: false as const, message: 'Start with a SELECT (or WITH) clause so we can understand the query.' }
	return { valid: true as const }
}

export function formatSqlErrorMessage(rawMessage: string): string {
	const message = rawMessage.replace(/\s+/g, ' ').trim()
	if (!message) return 'SQL error: Unknown error.'
	for (const { pattern, format } of SQL_ERROR_PATTERNS) {
		const match = message.match(pattern)
		if (match) return formatSentence(format(match))
	}
	if (/syntax error/i.test(message)) return 'Syntax error.'
	return formatSentence(`SQL error: ${message}`)
}

function formatSentence(value: string): string {
	const text = value.trim()
	if (!text) return text
	const sentence = text[0] === text[0].toLowerCase() ? text[0].toUpperCase() + text.slice(1) : text
	return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`
}

export interface SqlQueryValidationReport {
	results: QueryResult[]
	query: string
}

interface SqlQueryValidationOptions {
	inputValue: unknown
	database: Database | undefined
	signal: AbortSignal
}

export async function validateSqlQuery({ inputValue, database, signal }: SqlQueryValidationOptions) {
	// Check if it's something we can run.
	if (!isSqlInputValue(inputValue) || !inputValue.value) return { valid: false as const }
	const query = interpretSqlInputValue(inputValue)
	const syntax = validateSqlInput(query)
	if (!syntax.valid) return { valid: false as const, feedback: syntax.message }

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
	const databaseHandle = useCurrentUserExerciseDatabase()
	return useCallback(({ normalizedInput, signal }: { normalizedInput: unknown; signal: AbortSignal }) => validateSqlQuery({ inputValue: normalizedInput, signal, database: databaseHandle.database }), [databaseHandle.database])
}
