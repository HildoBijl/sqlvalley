import { useEffect, useMemo, useState } from 'react'

import { fromKeys } from '@step-wise/js-utils'

import type { DatabaseHandle, DatabaseSnapshot } from './types'
import type { DatabaseCache, DatabaseCacheConnection } from './databaseCache'
import { useDatabaseContext } from './context'

interface DatabaseSelection {
	key?: string
	tables?: readonly string[]
}

export interface DatabaseOptions extends DatabaseSelection {
	size?: string
}

export interface DatabasesOptions extends DatabaseSelection {
	sizes?: readonly string[]
}

// All data to request the databases gathered into one object.
interface DatabaseRequest {
	key?: string
	tables: string[]
	sizes?: string[]
	grouped: boolean
	cache: DatabaseCache | undefined
	error: Error | undefined
}

// The result of the request.
interface DatabaseState {
	request: DatabaseRequest
	handles: Map<string | undefined, DatabaseHandle>
}

type SerializedDatabaseRequest = Omit<DatabaseRequest, 'cache' | 'error'>

// Get a database for the given tables and size. Keyed databases are retained and shared.
export function useDatabase({ key, tables, size }: DatabaseOptions = {}): DatabaseHandle {
	return useDatabaseHandles({ key, tables }, size === undefined ? undefined : [size], false).get(size)!
}

// Own databases for the selected sizes, defaulting to all source sizes.
export function useDatabases(options: DatabasesOptions = {}): ReadonlyMap<string, DatabaseHandle> {
	return useDatabaseHandles(options, options.sizes)
}

// Shared lifecycle for single databases and collections, independent of caller array identity.
function useDatabaseHandles(options: DatabaseSelection, sizes?: readonly string[]): ReadonlyMap<string, DatabaseHandle>
function useDatabaseHandles(options: DatabaseSelection, sizes: readonly string[] | undefined, grouped: false): ReadonlyMap<string | undefined, DatabaseHandle>
function useDatabaseHandles({ key, tables }: DatabaseSelection, sizes?: readonly string[], grouped = true): ReadonlyMap<string | undefined, DatabaseHandle> {
	const { source, cache, error } = useDatabaseContext()
	const selectedSizes = grouped ? sizes ?? source.datasetSizes : sizes

	// Set up a stable request: an object whose data is sufficient to load the databases.
	const signature = JSON.stringify({ key, tables: [...new Set(tables ?? source.tableKeys)].sort(), sizes: selectedSizes, grouped })
	const request = useMemo<DatabaseRequest>(() => {
		const options = JSON.parse(signature) as SerializedDatabaseRequest
		return { ...options, cache, error }
	}, [signature, cache, error])

	// Set up storage for request results (the database state). Also set up pending handles to put into them until we have actual results.
	const [databaseState, setDatabaseState] = useState<DatabaseState>()
	const pendingHandles = useMemo<Map<string | undefined, DatabaseHandle>>(() => {
		const createHandle = (): DatabaseHandle => ({ database: undefined, loading: !request.error, error: request.error, reset: () => { } })
		if (request.sizes === undefined) return new Map([[undefined, createHandle()]])
		return new Map(Object.entries(fromKeys(request.sizes, createHandle)))
	}, [request])

	// Upon mounting, acquire the databases and store their snapshots. Keep connection handles to release them upon unmount or a changed request.
	useEffect(() => {
		if (!request.cache) return
		let active = true
		const connections: DatabaseCacheConnection[] = []
		for (const size of new Set(request.sizes ?? [undefined])) {
			// Set up an update handler that stores a snapshot of the database, for a specific size, once it's acquired.
			let connection: DatabaseCacheConnection | undefined
			const reset = () => connection?.reset()
			const storeSnapshotInState = (snapshot: DatabaseSnapshot) => {
				if (!active) return
				setDatabaseState(previous => {
					const handles = new Map(previous?.request === request ? previous.handles : pendingHandles)
					handles.set(size, { ...snapshot, loading: false, reset })
					return { request, handles }
				})
			}

			// Try to acquire a database from the cache, or store the error if it fails.
			const cacheKey = request.grouped && request.key !== undefined ? { group: request.key, size } : request.key
			try {
				connection = request.cache.acquire(cacheKey, JSON.stringify({ size, tables: request.tables }), storeSnapshotInState)
				connections.push(connection)
			} catch (error) {
				storeSnapshotInState({ database: undefined, error: error instanceof Error ? error : new Error(String(error)) })
			}
		}

		// On dismounting, release the connections.
		return () => {
			active = false
			connections.forEach(connection => connection.release())
		}
	}, [request, pendingHandles])

	// Return handles for the current request, hiding results from any previous request.
	if (grouped && !source.datasetSizes?.length) throw new Error('useDatabases requires a source with a nonempty datasetSizes list. Use useDatabase for a source without selectable sizes.')
	if (request.sizes?.length === 0) throw new Error('Select at least one database size.')
	return databaseState?.request === request ? databaseState.handles : pendingHandles
}
