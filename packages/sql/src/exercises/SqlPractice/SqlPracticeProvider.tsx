import { type ReactNode, useMemo } from 'react'

import type { DatasetSize } from '@sqlvalley/mock-data'

import { SqlPracticeContext } from './context'

interface SqlPracticeProviderProps {
	datasetSize: DatasetSize
	setDatasetSize: (size: DatasetSize) => void
	completionSchema: Record<string, string[]>
	children: ReactNode
}

// Practice configuration is separate from the module's execution context.
export function SqlPracticeProvider({ datasetSize, setDatasetSize, completionSchema, children }: SqlPracticeProviderProps) {
	const tableNames = useMemo(() => Object.keys(completionSchema).sort(), [completionSchema])
	return <SqlPracticeContext.Provider value={{ datasetSize, setDatasetSize, completionSchema, tableNames }}>
		{children}
	</SqlPracticeContext.Provider>
}
