import { type ReactNode, useEffect, useMemo } from 'react'

import { useSQLJSContext } from '@sqlvalley/sqljs'

import type { DatabaseSource } from './types'
import { DatabaseCache } from './databaseCache'
import { DatabaseContext } from './context'

interface DatabaseProviderProps {
	source: DatabaseSource
	children: ReactNode
}

export function DatabaseProvider({ source, children }: DatabaseProviderProps) {
	const { SQLJS, error } = useSQLJSContext()
	const cache = useMemo(() => SQLJS ? new DatabaseCache(SQLJS, source) : undefined, [SQLJS, source])
	useEffect(() => () => cache?.dispose(), [cache])

	return <DatabaseContext.Provider value={{ source, cache, error: error ?? undefined }}>
		{children}
	</DatabaseContext.Provider>
}
