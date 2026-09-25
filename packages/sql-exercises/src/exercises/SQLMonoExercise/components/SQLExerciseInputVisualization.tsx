import { type ReactNode, useEffect, useState } from 'react'
import { Alert, Box, Button, Collapse, Divider, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

import { isStateDone } from '@step-wise/exercise-definition'
import type { Database } from '@sqlvalley/sqljs'
import { DataTable, useDatasetSize } from '@sqlvalley/sql'
import { type MonoExerciseInputVisualizationProps, useInputExerciseContext } from '@sqlvalley/input-exercise-components'

import { sqlDatasetSizes } from '../../../datasetSizes'
import type { SqlQueryValidationReport } from '../../../sqlInput'
import { useSqlExerciseContext } from '../../../exerciseContext'

// The InputVisualization component for SQL Exercises.
export function SQLExerciseInputVisualization({ state }: MonoExerciseInputVisualizationProps) {
	// The validation has the query result, so use that to display the query output.
	const { getFieldValidation } = useInputExerciseContext()
	const validation = getFieldValidation('query')
	const validationReport = validation.status === 'valid' ? validation.report as SqlQueryValidationReport | undefined : undefined

	// Get the dataset size. Check the small-dataset-warning.
	const [datasetSize, setDatasetSize] = useDatasetSize()
	const showSmallDatasetWarning = useShowSmallDatasetWarning(validationReport)

	// Control expansion of the component. Hide the component upon exercise completion to make sure the solution becomes visible,
	const complete = isStateDone(state)
	const [expanded, setExpanded] = useState(() => !complete)
	useEffect(() => {
		setExpanded(!complete)
	}, [complete])

	// Set up the input visualization that renders the query output.
	const content = <QueryResults validationReport={validationReport} status={validation.status} showSmallDatasetWarning={showSmallDatasetWarning} />
	return <Paper variant="outlined" sx={{ my: 3, borderRadius: 2 }}>
		<Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
			<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Query Results</Typography>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
				<ToggleButtonGroup
					size="small"
					exclusive
					value={datasetSize}
					onChange={(_event, nextValue) => {
						if (!nextValue) return
						setDatasetSize(nextValue)
					}}
					sx={{
						flexWrap: 'wrap',
						'& .MuiToggleButton-root': {
							px: 1,
							py: 0.25,
							textTransform: 'none',
						},
					}}
				>
					<ToggleButton value={sqlDatasetSizes.small}>Use small data set</ToggleButton>
					<ToggleButton value={sqlDatasetSizes.full}>Use full data set</ToggleButton>
				</ToggleButtonGroup>
				<Button
					size="small"
					color="primary"
					variant="text"
					onClick={() => setExpanded(prev => !prev)}
					endIcon={expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
					sx={{ textTransform: 'none', fontWeight: 500, px: 1 }}
				>
					{expanded ? 'Hide' : 'Show'}
				</Button>
			</Box>
		</Box>
		<Collapse in={expanded} unmountOnExit>
			<Divider sx={{ mb: 2 }} />
			<Box sx={{ px: 2.5, pb: 2.5 }}>{content}</Box>
		</Collapse>
	</Paper>
}

// The component that displays query results when available, or a message if they're not.
function QueryResults({ validationReport, status, showSmallDatasetWarning }: { validationReport?: SqlQueryValidationReport; status: 'pending' | 'valid' | 'invalid'; showSmallDatasetWarning?: boolean }) {
	// If there are no results to show, show a message explaining why.
	if (status === 'pending') return <ResultsPlaceholder message="Updating query preview..." />
	if (status === 'invalid') return <ResultsPlaceholder message="Enter a valid query to preview results." />
	if (!validationReport) return <ResultsPlaceholder message="Enter a query to preview results." />

	// Display the given results.
	const result = validationReport.results[0]
	if (result && result.values.length > 0) return <DataTable data={result} />

	// If there are no results, show this with the small-dataset-warning added to it if needed.
	return <ResultsPlaceholder message="Query executed successfully but returned no rows.">
		{showSmallDatasetWarning ? <Alert severity="warning">You are using the small data set. This data set is meant to get a quick intuition of the data, but it does not support all exercises. Consider using the full data set to get the full real-life experience.</Alert> : null}
	</ResultsPlaceholder>
}

// A small container used to display a message about query results.
function ResultsPlaceholder({ message, children }: { message: string; children?: ReactNode }) {
	return <Box sx={{ px: 3, py: 6, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 1 }}>
		<Typography color="text.secondary">{message}</Typography>
		{children ? <Box sx={{ mt: 2, textAlign: 'left' }}>{children}</Box> : null}
	</Box>
}

// A storage type for the upcoming useShowSmallDatasetWarning function.
interface ComparisonResult {
	validationReport: SqlQueryValidationReport
	database: Database
	hasRows: boolean
}

// In the special case where the user runs a query on a small dataset, gets an empty result, but the full dataset would give output, we want to show a warning, informing the user to potentially go to the full dataset.
function useShowSmallDatasetWarning(validationReport: SqlQueryValidationReport | undefined): boolean {
	const [showWarningData, setShowWarningData] = useState<ComparisonResult>()

	// Determine whether the situation requires us to consider the small-dataset-warning: there is a query on the small dataset with no output.
	const [datasetSize] = useDatasetSize()
	const shouldCompare = datasetSize === sqlDatasetSizes.small && !!validationReport && !(validationReport.results[0]?.values.length)

	// When we should do a check, run the query.
	const { database } = useSqlExerciseContext().getUserDatabase(sqlDatasetSizes.full)
	useEffect(() => {
		if (!shouldCompare || !validationReport || !database) return

		// Run the query, but in a deferred way so that a changed preview can cancel it before execution.
		const timeout = setTimeout(() => {
			let hasRows = false
			try {
				hasRows = !!database.exec(validationReport.query)[0]?.values.length
			} catch { /* A failed comparison must not change validation feedback. */ }
			setShowWarningData({ validationReport, database, hasRows })
		}, 0)
		return () => clearTimeout(timeout)
	}, [shouldCompare, validationReport, database])

	// Determine whether to show the warning based on all available results: when the criteria are met, when the comparison is still valid, and when the full dataset DOES have rows.
	return shouldCompare && showWarningData?.validationReport === validationReport && showWarningData?.database === database && showWarningData?.hasRows
}
