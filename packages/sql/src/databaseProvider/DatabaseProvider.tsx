import { type ReactNode, createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

import { useSQLJS } from '@sqlvalley/sqljs'

import type { DatabaseSource, ManagedDatabase, GetDatabaseOptions } from './types'

type DatabaseState = Record<string, ManagedDatabase | null>

interface DatabaseContextValue {
	source: DatabaseSource
	databases: DatabaseState
	getDatabase: (key: string, schema: string, options?: GetDatabaseOptions) => any | null
	resetDatabase: (key: string) => void
	resetAllDatabases: () => void
	isReady: boolean
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null)

export function useDatabaseContext() {
	const context = useContext(DatabaseContext)
	if (!context) throw new Error('useDatabaseContext must be used within a DatabaseProvider')
	return context
}

interface DatabaseProviderProps {
	source: DatabaseSource
	children: ReactNode
}

export function DatabaseProvider({ source, children }: DatabaseProviderProps) {
	const SQLJS = useSQLJS()
	const [databases, setDatabases] = useState<DatabaseState>({})
	const databasesRef = useRef<DatabaseState>({})
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		setIsReady(!!SQLJS)
	}, [SQLJS])

	const createDatabase = useCallback((schema: string) => {
		if (!SQLJS) return null

		let db: any | null = null
		try {
			db = new SQLJS.Database()
			db.run(schema)
			return db
		} catch (error) {
			if (db && typeof db.close === 'function') {
				try {
					db.close()
				} catch (closeError) {
					console.warn('Failed to close database after initialization failed:', closeError)
				}
			}
			console.error('Failed to create database instance:', error)
			return null
		}
	}, [SQLJS])

	const updateDatabases = useCallback((updater: (prev: DatabaseState) => DatabaseState) => {
		setDatabases(prev => {
			const next = updater(prev)
			databasesRef.current = next
			return next
		})
	}, [])

	const getDatabase = useCallback((key: string, schema: string, options?: GetDatabaseOptions) => {
		if (key in databasesRef.current) return databasesRef.current[key]?.instance ?? null

		const newInstance = createDatabase(schema)
		const entry: ManagedDatabase | null = newInstance
			? {
				instance: newInstance,
				persistent: options?.persistent ?? false,
				metadata: options?.metadata,
				createdAt: Date.now(),
			}
			: null

		const next = { ...databasesRef.current, [key]: entry }
		databasesRef.current = next
		setDatabases(next)

		return newInstance
	}, [createDatabase])

	const resetDatabase = useCallback((key: string) => {
		const entry = databasesRef.current[key]
		if (entry?.instance && typeof entry.instance.close === 'function') {
			try {
				entry.instance.close()
			} catch (error) {
				console.warn(`Error closing database "${key}":`, error)
			}
		}

		updateDatabases(prev => {
			if (!(key in prev)) return prev
			const next = { ...prev }
			delete next[key]
			return next
		})
	}, [updateDatabases])

	const resetAllDatabases = useCallback(() => {
		Object.entries(databasesRef.current).forEach(([key, entry]) => {
			if (entry?.instance && typeof entry.instance.close === 'function') {
				try {
					entry.instance.close()
				} catch (error) {
					console.warn(`Error closing database "${key}":`, error)
				}
			}
		})

		databasesRef.current = {}
		setDatabases({})
	}, [])

	const resetTransientDatabases = useCallback(() => {
		const next: DatabaseState = { ...databasesRef.current }
		Object.entries(databasesRef.current).forEach(([key, entry]) => {
			if (!entry) {
				delete next[key]
				return
			}
			if (entry.persistent) return

			if (entry.instance && typeof entry.instance.close === 'function') {
				try {
					entry.instance.close()
				} catch (error) {
					console.warn(`Error closing transient database "${key}":`, error)
				}
			}
			delete next[key]
		})

		databasesRef.current = next
		setDatabases(next)
	}, [])

	useEffect(() => {
		return () => {
			resetTransientDatabases()
		}
	}, [resetTransientDatabases])

	// Auto-cleanup: drop transient databases older than 30 minutes
	useEffect(() => {
		const CHECK_INTERVAL_MS = 60_000
		const MAX_AGE_MS = 30 * 60_000

		const interval = setInterval(() => {
			const now = Date.now()
			const keysToRemove: string[] = []

			Object.entries(databasesRef.current).forEach(([key, entry]) => {
				if (!entry || entry.persistent) return
				if (!entry.createdAt) return
				if (now - entry.createdAt <= MAX_AGE_MS) return

				if (entry.instance && typeof entry.instance.close === 'function') {
					try {
						entry.instance.close()
					} catch (error) {
						console.warn(`Error closing stale database "${key}":`, error)
					}
				}
				keysToRemove.push(key)
			})

			if (keysToRemove.length === 0) return

			updateDatabases(prev => {
				const next = { ...prev }
				keysToRemove.forEach(key => {
					delete next[key]
				})
				return next
			})
		}, CHECK_INTERVAL_MS)

		return () => clearInterval(interval)
	}, [updateDatabases])

	useEffect(() => {
		const onVisibilityChange = () => {
			if (document.hidden) resetTransientDatabases()
		}
		document.addEventListener('visibilitychange', onVisibilityChange)
		return () => document.removeEventListener('visibilitychange', onVisibilityChange)
	}, [resetTransientDatabases])

	const value: DatabaseContextValue = {
		source,
		databases,
		getDatabase,
		resetDatabase,
		resetAllDatabases,
		isReady,
	}

	return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
}
