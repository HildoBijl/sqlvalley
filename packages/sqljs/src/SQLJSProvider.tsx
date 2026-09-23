import { type ReactNode, useEffect, useState } from 'react'
import type { SqlJsStatic } from 'sql.js'

import { SQLJSContext } from './context'
import { loadSQLJS } from './loadSQLJS'

interface SQLJSProviderProps {
	children: ReactNode
}

// Load SQL.js and provide its state to the application.
export function SQLJSProvider({ children }: SQLJSProviderProps) {
	// Set up memory storage for the loading process.
	const [SQLJS, setSQLJS] = useState<SqlJsStatic | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	// Load SQLJS upon mounting.
	useEffect(() => {
		let active = true
		setLoading(true)
		setError(null)
		loadSQLJS().then(instance => {
			if (active) setSQLJS(instance)
		}).catch(error => {
			if (!active) return
			const resolvedError = error instanceof Error ? error : new Error('Failed to initialize SQL.js')
			setError(resolvedError)
			console.error('SQL.js initialization failed:', resolvedError)
		}).finally(() => {
			if (active) setLoading(false)
		})
		return () => { active = false }
	}, [])

	// Make all contents available through a provider.
	const ready = !!SQLJS && !loading && !error
	return <SQLJSContext.Provider value={{ SQLJS, loading, error, ready }}>
		{children}
	</SQLJSContext.Provider>
}
