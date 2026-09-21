import { createContext, useContext } from 'react'

import type { DatasetSize } from '@sqlvalley/mock-data'

import type { QueryResult } from '../../databaseProvider'

export interface SqlPracticeContextValue {
	completionSchema: Record<string, string[]>
	tableNames: string[]
	datasetSize: DatasetSize
	setDatasetSize: (size: DatasetSize) => void
	queryResult: QueryResult[] | undefined
	queryError: Error | undefined
	hasExecutedQuery: boolean
	datasetWarning: string | undefined
	executeLiveQuery: (query: string) => Promise<void>
}

export const SqlPracticeContext = createContext<SqlPracticeContextValue | undefined>(undefined)

export function useSqlPracticeContext() {
	const context = useContext(SqlPracticeContext)
	if (!context) throw new Error('SQL practice components require a SqlPracticeProvider.')
	return context
}
