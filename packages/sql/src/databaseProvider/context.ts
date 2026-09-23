import { createContext, useContext } from 'react'

import type { DatabaseSource } from './types'
import type { DatabaseCache } from './databaseCache'

interface DatabaseContextValue {
	datasetSize: string | undefined
	setDatasetSize: (size: string | undefined) => void
	source: DatabaseSource
	cache: DatabaseCache | undefined
	error: Error | undefined
}

export const DatabaseContext = createContext<DatabaseContextValue | undefined>(undefined)

export function useDatabaseContext() {
	const context = useContext(DatabaseContext)
	if (!context) throw new Error('useDatabase must be used within a DatabaseProvider.')
	return context
}
