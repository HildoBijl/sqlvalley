import type { ComponentType } from 'react'
import { Alert } from '@mui/material'

import { type MonoExerciseProblemProps, type MonoExerciseInputAreaProps, type MonoExerciseInputVisualizationProps, useInputField, useSolution } from '@sqlvalley/input-exercise-components'

import { useSqlPracticeContext } from '../SqlPractice'
import type { MonoSQLCheckResult } from './types'
import { ExerciseDescription } from './components/ExerciseDescription'
import { ExerciseEditor } from './components/ExerciseEditor'
import { ExerciseResults } from './components/ExerciseResults'
import { ExerciseSolution } from './components/ExerciseSolution'

export function SQLExerciseInputArea<Parameters extends Record<string, unknown>>({
	disabled,
	onSubmit,
}: MonoExerciseInputAreaProps<Parameters, string>) {
	const runtime = useSqlPracticeContext()
	const { value, setValue } = useInputField('query', 'SQL')
	return (
		<>
			<ExerciseEditor
				query={typeof value?.value === 'string' ? value.value : ''}
				onQueryChange={setValue}
				onExecute={onSubmit}
				onLiveExecute={runtime.executeLiveQuery}
				readOnly={disabled}
				completionSchema={runtime.completionSchema}
			/>
			{runtime.queryError ? (
				<Alert severity="warning" sx={{ mt: 1.5 }}>
					{runtime.queryError.message || 'Query execution failed.'}
				</Alert>
			) : null}
		</>
	)
}

export function SQLExerciseInputVisualization<Parameters extends Record<string, unknown>>({
	state,
}: MonoExerciseInputVisualizationProps<Parameters, string, MonoSQLCheckResult>) {
	const runtime = useSqlPracticeContext()
	const complete = state.done === true
	return (
		<ExerciseResults
			queryResult={runtime.queryResult}
			queryError={runtime.queryError}
			hasExecuted={runtime.hasExecutedQuery}
			isComplete={complete}
			datasetSize={runtime.datasetSize}
			onDatasetSizeChange={runtime.setDatasetSize}
			datasetWarning={runtime.datasetWarning}
		/>
	)
}

export function createSQLProblem<Parameters extends Record<string, unknown>>(
	Problem: ComponentType<MonoExerciseProblemProps<Parameters>>,
) {
	return function SQLExerciseProblem({ parameters }: { parameters: Parameters }) {
		const runtime = useSqlPracticeContext()
		return (
			<ExerciseDescription
				description={<Problem parameters={parameters} />}
				tableNames={runtime.tableNames}
			/>
		)
	}
}

export function SQLExerciseSolution() {
	const solution = useSolution()
	if (!solution || typeof solution.query !== 'string') throw new Error('A SQL solution must contain a query string.')
	return <ExerciseSolution solution={{ query: solution.query }} />
}
