import { useMemo } from 'react'

import { useDatabaseContext } from '../databaseProvider'
import { useModuleTableKeys } from './hooks'

export function useModuleCompletionSchema(): Record<string, string[]> {
	const { source } = useDatabaseContext()
	const tableKeys = useModuleTableKeys()
	return useMemo(() => source.buildCompletionSchema?.(tableKeys) ?? {}, [source, tableKeys])
}
