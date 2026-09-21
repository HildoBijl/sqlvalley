import { useCallback, useEffect, useRef, useState } from 'react'

import type { DatasetSize } from '@sqlvalley/mock-data'

import { useQueryExecution } from '../../databaseProvider'
import { useModuleDatabase } from '../../sqlModuleProvider'

const SMALL_DATASET_WARNING = 'You are using the small data set. This data set is meant to get a quick intuition of the data, but it does not support all exercises. Consider using the full data set to get the full real-life experience.'

export function useSqlPreview(datasetSize: DatasetSize) {
	const display = useModuleDatabase(datasetSize)
	const full = useModuleDatabase('full')
	const { execute, clear, results, error } = useQueryExecution(display)
	const [datasetWarning, setDatasetWarning] = useState<string>()
	const lastQuery = useRef('')
	const execution = useRef(0)

	const executeLiveQuery = useCallback(async (query: string) => {
		const request = ++execution.current
		lastQuery.current = query
		setDatasetWarning(undefined)
		if (!query.trim()) {
			clear()
			return
		}
		try {
			const output = await execute(query)
			if (request !== execution.current || datasetSize !== 'small' || output.some(result => result.values.length > 0)) return
			const fullOutput = full.database?.exec(query)
			if (fullOutput?.some(result => result.values.length > 0)) setDatasetWarning(SMALL_DATASET_WARNING)
		} catch {
			// Query errors are exposed by useQueryExecution; a failed full preview adds no warning.
		}
	}, [execute, clear, datasetSize, full.database])

	// Re-run the current preview when its database changes, including size switches.
	useEffect(() => {
		void executeLiveQuery(lastQuery.current)
		return () => { execution.current = execution.current + 1 }
	}, [executeLiveQuery])

	return {
		queryResult: results,
		queryError: error,
		hasExecutedQuery: results !== undefined,
		datasetWarning,
		executeLiveQuery,
	}
}
