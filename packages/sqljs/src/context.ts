import { createContext } from 'react'
import type { SqlJsStatic } from 'sql.js'

export interface SQLJSContextValue {
	SQLJS: SqlJsStatic | null
	error: Error | null
	isLoading: boolean
	isReady: boolean
}

export const SQLJSContext = createContext<SQLJSContextValue>({
	SQLJS: null,
	error: null,
	isLoading: true,
	isReady: false,
})
