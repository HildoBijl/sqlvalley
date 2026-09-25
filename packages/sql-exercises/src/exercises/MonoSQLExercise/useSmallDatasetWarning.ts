import { useEffect, useState } from 'react'

import { useDatasetSize } from '@sqlvalley/sql'
import type { Database } from '@sqlvalley/sqljs'

import type { SqlQueryValidationReport } from '../../sqlInput'
import { useSqlExerciseContext } from '../../exerciseContext'

const SMALL_DATASET_WARNING = 'You are using the small data set. This data set is meant to get a quick intuition of the data, but it does not support all exercises. Consider using the full data set to get the full real-life experience.'

interface ComparisonResult {
	preview: SqlQueryValidationReport
	database: Database
	hasRows: boolean
}

export function useSmallDatasetWarning(preview: SqlQueryValidationReport | undefined): string | undefined {
	const [datasetSize] = useDatasetSize()
	const { database } = useSqlExerciseContext().getUserDatabase('full')
	const [comparison, setComparison] = useState<ComparisonResult>()
	const shouldCompare = datasetSize === 'small' && !!preview && !preview.results.some(result => result.values.length > 0)

	useEffect(() => {
		if (!shouldCompare || !preview || !database) return
		// Defer the optional query so a changed preview can cancel it before execution.
		const timeout = setTimeout(() => {
			let hasRows = false
			try {
				hasRows = database.exec(preview.query).some(result => result.values.length > 0)
			} catch { /* A failed comparison must not change validation feedback. */ }
			setComparison({ preview, database, hasRows })
		}, 0)
		return () => clearTimeout(timeout)
	}, [shouldCompare, preview, database])

	return shouldCompare && comparison?.preview === preview && comparison?.database === database && comparison?.hasRows ? SMALL_DATASET_WARNING : undefined
}
