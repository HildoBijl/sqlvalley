import type { Database, SqlJsStatic } from '@sqlvalley/sqljs'

import type { DatabaseSource, DatabaseSnapshot } from './types'

// A caching entry: its origins, the snapshot to the database that was created for it, and the listeners that follow it.
interface Entry {
	signature: string
	sql?: string
	snapshot: DatabaseSnapshot
	listeners: Set<(snapshot: DatabaseSnapshot) => void>
}

// Unique ways of identifying a database cache entry. For groups (obtaining multiple sizes at a same time) we use an object key. For all other cases, we use a string key.
export type DatabaseCacheKey = string | { group: string; size: string | undefined }

// A connection object returned upon creating a database with controlling handles.
export interface DatabaseCacheConnection {
	reset: () => void
	release: () => void
}

// Only keyed databases are cached. Unkeyed databases are tracked for cleanup.
export class DatabaseCache {
	private keyedEntries = new Map<string, Entry>()
	private groupedEntries = new Map<string, Map<string | undefined, Entry>>()
	private unkeyedEntries = new Set<Entry>()

	// The constructor stores the SQLJS engine and the source.
	constructor(private engine: SqlJsStatic, private source: DatabaseSource) { }

	// Get a database object, either existing or new, given the provided options.
	acquire(key: DatabaseCacheKey | undefined, signature: string, listener: (snapshot: DatabaseSnapshot) => void): DatabaseCacheConnection {
		// Check that an appropriate dataset size is provided in the signature (unless none is needed).
		const { size } = JSON.parse(signature) as { size?: string }
		const { datasetSizes } = this.source
		if (datasetSizes !== undefined) {
			if (datasetSizes.length === 0) throw new Error('Database source sizes must not be empty. Omit sizes for a source without size variants.')
			if (size === undefined) throw new Error('A database size is required for this source.')
			if (!datasetSizes.includes(size)) throw new Error(`Unknown database size "${size}". Expected one of: ${datasetSizes.join(', ')}.`)
		} else if (size !== undefined) {
			throw new Error('This database source has no size variants. Omit size when requesting a database.')
		}

		// If no cache entry is present, make one.
		const entriesMap = typeof key === 'object' ? this.getGroup(key.group) : this.keyedEntries
		const entryKey = typeof key === 'object' ? key.size : key
		let entry = key === undefined ? undefined : entriesMap.get(entryKey)
		if (entry && entry.signature !== signature) throw new Error(`Database key ${JSON.stringify(key)} is already in use with different tables or size.`)
		if (!entry) {
			entry = { signature, snapshot: { database: undefined, error: undefined }, listeners: new Set() }
			entry.snapshot = this.createSnapshot(entry)
			if (key === undefined) this.unkeyedEntries.add(entry)
			else entriesMap.set(entryKey, entry)
		}
		const acquired = entry

		// If a listener is provided, update said listener about the creation of the snapshot.
		acquired.listeners.add(listener)
		listener(acquired.snapshot)

		// Set up controls to the database's caching entry.
		return {
			// Reset the database by removing and rebuilding one.
			reset: (): void => {
				const active = key === undefined ? this.unkeyedEntries.has(acquired) : entriesMap.get(entryKey) === acquired
				if (!active) return
				acquired.snapshot.database?.close()
				acquired.snapshot = this.createSnapshot(acquired)
				acquired.listeners.forEach((notify): void => notify(acquired.snapshot))
			},

			// Stop listening and close private databases; keyed databases remain cached.
			release: (): void => {
				acquired.listeners.delete(listener)
				if (key !== undefined || !this.unkeyedEntries.delete(acquired)) return
				acquired.snapshot.database?.close()
			},
		}
	}

	private getGroup(key: string): Map<string | undefined, Entry> {
		let entries = this.groupedEntries.get(key)
		if (!entries) {
			entries = new Map<string | undefined, Entry>()
			this.groupedEntries.set(key, entries)
		}
		return entries
	}

	// Try creating a database from a given entry.
	private createSnapshot(entry: Entry): DatabaseSnapshot {
		try {
			if (entry.sql === undefined) { // Remember the SQL to only build it once, even if the create fails.
				const options = JSON.parse(entry.signature) as { size?: string; tables: string[] }
				entry.sql = this.source.buildSql(options)
			}
			return this.create(entry.sql)
		} catch (error) {
			return { database: undefined, error: error instanceof Error ? error : new Error(String(error)) }
		}
	}

	// Build a new database from the given SQL command.
	private create(sql: string): DatabaseSnapshot {
		let database: Database | undefined
		try {
			database = new this.engine.Database()
			if (sql) database.run(sql)
			return { database, error: undefined }
		} catch (error) {
			database?.close()
			return { database: undefined, error: error instanceof Error ? error : new Error(String(error)) }
		}
	}

	// Close both databases with and without keys.
	dispose(): void {
		this.keyedEntries.forEach((entry): void => entry.snapshot.database?.close())
		this.keyedEntries.clear()
		this.groupedEntries.forEach((entries): void => {
			entries.forEach((entry): void => entry.snapshot.database?.close())
			entries.clear()
		})
		this.groupedEntries.clear()
		this.unkeyedEntries.forEach((entry): void => entry.snapshot.database?.close())
		this.unkeyedEntries.clear()
	}
}
