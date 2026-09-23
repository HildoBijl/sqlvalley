import { useMemo } from 'react'

import { useDatabaseContext, useDatasetSize } from '@sqlvalley/sql'
import { useModuleContext } from '@sqlvalley/exercise-manager'

import { type SqlModuleContext, ensureSqlModuleContext } from './types'

export function useSqlModuleContext(): SqlModuleContext {
	return ensureSqlModuleContext(useModuleContext())
}

export function useUserModuleDatabase(size?: string) {
	return useSqlModuleContext().getUserDatabase(size)
}

export function useGradingModuleDatabase(size?: string) {
	return useSqlModuleContext().getGradingDatabase(size)
}

export function useModuleTableKeys() {
	return useSqlModuleContext().tableKeys
}

export function useModuleCompletionSchema(): Record<string, string[]> {
	const { source } = useDatabaseContext()
	const tableKeys = useModuleTableKeys()
	return useMemo(() => source.buildCompletionSchema?.(tableKeys) ?? {}, [source, tableKeys])
}

export function useCurrentUserModuleDatabase() {
	const [datasetSize] = useDatasetSize()
	return useUserModuleDatabase(datasetSize)
}
