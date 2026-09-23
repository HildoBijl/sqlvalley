import { useCallback } from 'react'

import { useCurrentUserModuleDatabase } from '../sqlModuleProvider'
import { validateSqlQuery } from './validation'

export function useSqlQueryValidation() {
	const selected = useCurrentUserModuleDatabase()
	return useCallback(({ normalizedInput, signal }: { normalizedInput: unknown; signal: AbortSignal }) =>
		validateSqlQuery({ normalizedInput, signal, database: selected.database }),
	[selected.database])
}
