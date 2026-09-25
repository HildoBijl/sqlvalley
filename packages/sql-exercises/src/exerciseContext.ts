import { useMemo } from 'react'

import { useDatabaseContext, useDatasetSize } from '@sqlvalley/sql'
import { useExerciseContext } from '@sqlvalley/exercise-manager'

import { ensureSqlModuleContext } from './sqlModuleProvider'

export function useSqlExerciseContext() {
	return ensureSqlModuleContext(useExerciseContext())
}

export function useCurrentUserExerciseDatabase() {
	const [size] = useDatasetSize()
	return useSqlExerciseContext().getUserDatabase(size)
}

export function useExerciseCompletionSchema(): Record<string, string[]> {
	const { source } = useDatabaseContext()
	const { tableKeys } = useSqlExerciseContext()
	return useMemo(() => source.buildCompletionSchema?.(tableKeys) ?? {}, [source, tableKeys])
}
