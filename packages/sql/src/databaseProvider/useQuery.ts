import { useEffect, useState } from 'react'

import type { DatabaseHandle, QueryResult } from './types'

interface QueryResultState {
	database: DatabaseHandle['database']
	query: string | undefined
	results?: QueryResult[]
	error?: Error
}

// Use an existing database handle to run a query on and get its results.
export function useQuery({ database, loading, error }: DatabaseHandle, query: string | undefined) {
	const [queryResultState, setQueryResultState] = useState<QueryResultState>()

	// Run the query whenever the database or query string changes.
	useEffect(() => {
		if (!database || !query) return
		try {
			setQueryResultState({ database, query, results: database.exec(query) })
		} catch (error) {
			setQueryResultState({ database, query, error: error instanceof Error ? error : new Error(String(error)) })
		}
	}, [database, query])

	// If the stored result is valid, bundle and return it.
	const current = database && query && queryResultState?.database === database && queryResultState.query === query ? queryResultState : undefined
	return {
		loading: loading || Boolean(database && query && !current),
		error: error ?? current?.error,
		results: current?.results,
	}
}

export function useQueryResults(...args: Parameters<typeof useQuery>) {
	return useQuery(...args).results
}

export function useQueryResult(...args: Parameters<typeof useQuery>): QueryResult | undefined {
	return useQueryResults(...args)?.[0]
}
