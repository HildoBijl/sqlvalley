import { useCallback } from 'react'

import { useUserModuleDatabase } from '../sqlModuleProvider'
import { useSqlPracticeContext } from '../exercises/SqlPractice'
import { validateSqlQuery } from './validation'

export function useSqlQueryValidation() {
	const { datasetSize } = useSqlPracticeContext()
	const selected = useUserModuleDatabase(datasetSize)
	return useCallback(({ normalizedInput, signal }: { normalizedInput: unknown; signal: AbortSignal }) =>
		validateSqlQuery({ normalizedInput, signal, database: selected.database }),
	[selected.database])
}
