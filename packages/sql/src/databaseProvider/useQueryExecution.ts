import { useCallback, useState } from 'react'

import type { DatabaseHandle, QueryResult } from './types'

// Event-driven query execution, with results local to the calling component.
export function useQueryExecution({ database, error }: DatabaseHandle) {
	const [state, setState] = useState<{ database: DatabaseHandle['database']; results?: QueryResult[]; error?: Error }>()
	const clear = useCallback(() => setState(undefined), [])
	const execute = useCallback(async (query: string) => {
		try {
			if (!database) throw error ?? new Error('Database is not ready.')
			const results = database.exec(query)
			setState({ database, results })
			return results
		} catch (error) {
			const queryError = error instanceof Error ? error : new Error(String(error))
			setState({ database, error: queryError })
			throw queryError
		}
	}, [database, error])
	const current = state?.database === database ? state : undefined
	return { execute, clear, results: current?.results, error: error ?? current?.error }
}
