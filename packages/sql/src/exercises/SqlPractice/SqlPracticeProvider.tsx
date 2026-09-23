import { type ReactNode } from 'react'

import type { DatasetSize } from '@sqlvalley/mock-data'

import { SqlPracticeContext } from './context'

interface SqlPracticeProviderProps {
	datasetSize: DatasetSize
	setDatasetSize: (size: DatasetSize) => void
	children: ReactNode
}

// Practice configuration is separate from the module's execution context.
export function SqlPracticeProvider({ datasetSize, setDatasetSize, children }: SqlPracticeProviderProps) {
	return <SqlPracticeContext.Provider value={{ datasetSize, setDatasetSize }}>
		{children}
	</SqlPracticeContext.Provider>
}
