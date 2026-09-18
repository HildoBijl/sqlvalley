import type { Database, SqlJsStatic } from '@sqlvalley/sqljs'

import type { DatabaseSource } from './types'

interface Snapshot {
	database?: Database
	error?: Error
}

interface Entry {
	signature: string
	sql?: string
	snapshot: Snapshot
	listeners: Set<(snapshot: Snapshot) => void>
}

// Only keyed databases are cached. Unkeyed databases are tracked for cleanup.
export class DatabaseCache {
	private keyedEntries = new Map<string, Entry>()
	private unkeyedEntries = new Set<Entry>()

	// The constructor stores the SQLJS engine and the source.
	constructor(private engine: SqlJsStatic, private source: DatabaseSource) { }

	// Get a database object, either existing or new, given the provided options.
	acquire(key: string | undefined, signature: string, listener: (snapshot: Snapshot) => void) {
		const { size } = JSON.parse(signature) as { size?: string }

		// Check that a dataset size is provided if one is needed.
		const { datasetSizes } = this.source
		if (datasetSizes !== undefined) {
			if (datasetSizes.length === 0) throw new Error('Database source sizes must not be empty. Omit sizes for a source without size variants.')
			if (size === undefined) throw new Error('A database size is required for this source.')
			if (!datasetSizes.includes(size)) throw new Error(`Unknown database size "${size}". Expected one of: ${datasetSizes.join(', ')}.`)
		} else if (size !== undefined) {
			throw new Error('This database source has no size variants. Omit size when requesting a database.')
		}

		// If no cache entry is present, make one.
		let entry = key === undefined ? undefined : this.keyedEntries.get(key)
		if (entry && entry.signature !== signature) throw new Error(`Database key "${String(key)}" is already in use with different tables or size.`)
		if (!entry) {
			entry = { signature, snapshot: {}, listeners: new Set() }
			entry.snapshot = this.createSnapshot(entry)
			if (key === undefined) this.unkeyedEntries.add(entry)
			else this.keyedEntries.set(key, entry)
		}
		const acquired = entry

		// If a listener is provided, update said listener about the creation of the snapshot.
		acquired.listeners.add(listener)
		listener(acquired.snapshot)

		// Set up controls to the database's caching entry.
		return {
			// Reset the database by removing and rebuilding one.
			reset: () => {
				const active = key === undefined ? this.unkeyedEntries.has(acquired) : this.keyedEntries.get(key) === acquired
				if (!active) return
				acquired.snapshot.database?.close()
				acquired.snapshot = this.createSnapshot(acquired)
				acquired.listeners.forEach(notify => notify(acquired.snapshot))
			},

			// Stop listening and close private databases; keyed databases remain cached.
			release: () => {
				acquired.listeners.delete(listener)
				if (key !== undefined || !this.unkeyedEntries.delete(acquired)) return
				acquired.snapshot.database?.close()
			},
		}
	}

	// Try creating a database from a given entry.
	private createSnapshot(entry: Entry): Snapshot {
		try {
			if (entry.sql === undefined) {
				const options = JSON.parse(entry.signature) as { size?: string; tables: string[] }
				entry.sql = this.source.buildSql(options)
			}
			return this.create(entry.sql)
		} catch (error) {
			return { error: error instanceof Error ? error : new Error(String(error)) }
		}
	}

	// Build a new database from the cached SQL.
	private create(sql: string): Snapshot {
		let database: Database | undefined
		try {
			database = new this.engine.Database()
			if (sql) database.run(sql)
			return { database }
		} catch (error) {
			database?.close()
			return { error: error instanceof Error ? error : new Error(String(error)) }
		}
	}

	// Close both databases with and without keys.
	dispose() {
		this.keyedEntries.forEach(entry => entry.snapshot.database?.close())
		this.keyedEntries.clear()
		this.unkeyedEntries.forEach(entry => entry.snapshot.database?.close())
		this.unkeyedEntries.clear()
	}
}
