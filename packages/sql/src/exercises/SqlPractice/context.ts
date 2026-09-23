import { createContext, useContext } from 'react'

import type { DatasetSize } from '@sqlvalley/mock-data'

export interface SqlPracticeContextValue {
	datasetSize: DatasetSize
	setDatasetSize: (size: DatasetSize) => void
}

export const SqlPracticeContext = createContext<SqlPracticeContextValue | undefined>(undefined)

export function useSqlPracticeContext() {
	const context = useContext(SqlPracticeContext)
	if (!context) throw new Error('SQL practice components require a SqlPracticeProvider.')
	return context
}
