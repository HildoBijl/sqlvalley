import { createContext } from 'react'
import type { SqlJsStatic } from 'sql.js'

export interface SQLJSContextValue {
	SQLJS: SqlJsStatic | null
	error: Error | null
	loading: boolean
	ready: boolean
}

export const SQLJSContext = createContext<SQLJSContextValue>({
	SQLJS: null,
	error: null,
	loading: true,
	ready: false,
})
