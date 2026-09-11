import { type ReactNode, useEffect, useState } from 'react'
import type { SqlJsStatic } from 'sql.js'
import { SQLJSContext } from './context'
import { loadSQLJS } from './loadSQLJS'

interface SQLJSProviderProps {
	children: ReactNode
}

// Load SQL.js and provide its state to the application.
export function SQLJSProvider({ children }: SQLJSProviderProps) {
	const [SQLJS, setSQLJS] = useState<SqlJsStatic | null>(null)
	const [error, setError] = useState<Error | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const isReady = !!SQLJS && !isLoading && !error

	useEffect(() => {
		let active = true
		setIsLoading(true)
		setError(null)
		loadSQLJS().then(instance => {
			if (active) setSQLJS(instance)
		}).catch(error => {
			if (!active) return
			const resolvedError = error instanceof Error ? error : new Error('Failed to initialize SQL.js')
			setError(resolvedError)
			console.error('SQL.js initialization failed:', resolvedError)
		}).finally(() => {
			if (active) setIsLoading(false)
		})
		return () => { active = false }
	}, [])

	return <SQLJSContext.Provider value={{ SQLJS, error, isLoading, isReady }}>
		{children}
	</SQLJSContext.Provider>
}
