import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { DatabaseHandle, DatabaseOptions } from './types'
import type { DatabaseCache } from './databaseCache'
import { useDatabaseContext } from './context'

// All data to request a database gathered into one object.
interface DatabaseRequest {
	key: string | undefined
	signature: string
	cache: DatabaseCache | undefined
}

// The result of the request.
interface DatabaseState {
	request: DatabaseRequest
	database?: DatabaseHandle['database']
	error?: Error
}

// Connection handlers to the database cache.
interface DatabaseCacheConnection {
	reset: () => void
	release: () => void
}

// Get a database for the given tables and size. If a key is given, the database is persisted and kept for other places to use the same key.
export function useDatabase({ key, tables, size }: DatabaseOptions = {}): DatabaseHandle {
	const { source, cache, error } = useDatabaseContext()

	// Set up a request: a constant object whose data is sufficient to load in the database.
	const signature = JSON.stringify({ size, tables: [...new Set(tables ?? source.tableKeys)].sort() })
	const request = useMemo(() => ({ key, signature, cache }), [key, signature, cache])

	// Upon mounting, get the database from the cache and store it. Keep a connection handle to release the database upon dismount.
	const [requestResult, setRequestResult] = useState<DatabaseState>()
	const cacheConnection = useRef<DatabaseCacheConnection | undefined>(undefined)
	useEffect(() => {
		if (!request.cache) return
		try {
			cacheConnection.current = request.cache.acquire(request.key, request.signature, snapshot => setRequestResult({ request, ...snapshot }))
		} catch (error) {
			setRequestResult({ request, error: error instanceof Error ? error : new Error(String(error)) })
		}
		return () => {
			cacheConnection.current?.release()
			cacheConnection.current = undefined
		}
	}, [request])

	// Build the Database Handle to return.
	const currentResult = requestResult?.request === request ? requestResult : undefined
	const databaseError = error ?? currentResult?.error
	const reset = useCallback(() => cacheConnection.current?.reset(), [])
	return {
		database: currentResult?.database,
		loading: !databaseError && !currentResult?.database,
		error: databaseError,
		reset,
	}
}

export function useTheorySampleDatabase() {
	return useDatabase({ size: 'small' })
}
