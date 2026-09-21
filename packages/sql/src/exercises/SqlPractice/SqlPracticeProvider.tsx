import { type ReactNode, useMemo } from 'react'

import type { DatasetSize } from '@sqlvalley/mock-data'

import { SqlPracticeContext } from './context'
import { useSqlPreview } from './useSqlPreview'

interface SqlPracticeProviderProps {
	datasetSize: DatasetSize
	setDatasetSize: (size: DatasetSize) => void
	completionSchema: Record<string, string[]>
	children: ReactNode
}

// UI preferences and preview results are separate from the module's execution context.
export function SqlPracticeProvider({ datasetSize, setDatasetSize, completionSchema, children }: SqlPracticeProviderProps) {
	const preview = useSqlPreview(datasetSize)
	const tableNames = useMemo(() => Object.keys(completionSchema).sort(), [completionSchema])
	return <SqlPracticeContext.Provider value={{ ...preview, datasetSize, setDatasetSize, completionSchema, tableNames }}>
		{children}
	</SqlPracticeContext.Provider>
}
