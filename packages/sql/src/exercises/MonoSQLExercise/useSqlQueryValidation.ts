import { useCallback, useMemo } from 'react'

import { formatSqlErrorMessage, validateSqlInput } from '@sqlvalley/sql-grading'

import type { QueryResult } from '../../databaseProvider'
import { useUserModuleDatabase } from '../../sqlModuleProvider'
import { useSqlPracticeContext } from '../SqlPractice'

const SMALL_DATASET_WARNING = 'You are using the small data set. This data set is meant to get a quick intuition of the data, but it does not support all exercises. Consider using the full data set to get the full real-life experience.'

export interface SqlQueryValidationReport {
	results: QueryResult[]
	datasetWarning?: string
}

export function useSqlQueryValidation() {
	const { datasetSize } = useSqlPracticeContext()
	const selected = useUserModuleDatabase(datasetSize)
	const full = useUserModuleDatabase('full')
	const normalizeInput = useCallback((value: unknown) => typeof value === 'object' && value !== null && 'value' in value && typeof value.value === 'string' ? value.value.trim() : '', [])
	const validate = useCallback(async ({ normalizedInput, signal }: { normalizedInput: unknown; signal: AbortSignal }) => {
		const query = typeof normalizedInput === 'string' ? normalizedInput : ''
		if (!query) return { valid: false as const }
		const syntax = validateSqlInput(query)
		if (!syntax.ok) return { valid: false as const, feedback: syntax.message }
		await new Promise(resolve => setTimeout(resolve, 150))
		if (signal.aborted) return { valid: false as const }
		try {
			if (!selected.database) throw selected.error ?? new Error('Database is not ready.')
			const results = selected.database.exec(query)
			let datasetWarning: string | undefined
			if (datasetSize === 'small' && !results.some(result => result.values.length > 0)) {
				try {
					if (full.database?.exec(query).some(result => result.values.length > 0)) datasetWarning = SMALL_DATASET_WARNING
				} catch { /* The full-dataset comparison is only a hint. */ }
			}
			return { valid: true as const, report: { results, datasetWarning } satisfies SqlQueryValidationReport }
		} catch (error) {
			return { valid: false as const, feedback: formatSqlErrorMessage(error instanceof Error ? error.message : String(error)) }
		}
	}, [selected.database, selected.error, full.database, datasetSize])
	return useMemo(() => ({ normalizeInput, validate }), [normalizeInput, validate])
}
