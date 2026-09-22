import type { ComponentType } from 'react'
import { Alert } from '@mui/material'

import { type MonoExerciseProblemProps, type MonoExerciseInputAreaProps, type MonoExerciseInputVisualizationProps, useInputExerciseContext, useInputField, useSolution } from '@sqlvalley/input-exercise-components'

import { useSqlPracticeContext } from '../SqlPractice'
import { ExerciseDescription } from './components/ExerciseDescription'
import { ExerciseEditor } from './components/ExerciseEditor'
import { ExerciseResults } from './components/ExerciseResults'
import { ExerciseSolution } from './components/ExerciseSolution'
import { type SqlQueryValidationReport, useSqlQueryValidation } from './useSqlQueryValidation'

export function SQLExerciseInputArea({
	disabled,
	onSubmit,
}: MonoExerciseInputAreaProps) {
	const runtime = useSqlPracticeContext()
	const validationOptions = useSqlQueryValidation()
	const { value, setValue, validation } = useInputField('query', { type: 'SQL', ...validationOptions })
	return (
		<>
			<ExerciseEditor
				query={typeof value?.value === 'string' ? value.value : ''}
				onQueryChange={setValue}
				onExecute={onSubmit}
				readOnly={disabled}
				invalid={validation.status === 'invalid'}
				completionSchema={runtime.completionSchema}
			/>
			{validation.status === 'invalid' && validation.feedback ? (
				<Alert severity="warning" sx={{ mt: 1.5 }}>
					{validation.feedback}
				</Alert>
			) : null}
		</>
	)
}

export function SQLExerciseInputVisualization({
	state,
}: MonoExerciseInputVisualizationProps) {
	const runtime = useSqlPracticeContext()
	const { getFieldValidation } = useInputExerciseContext()
	const validation = getFieldValidation('query')
	const preview = validation.status === 'valid' ? validation.report as SqlQueryValidationReport | undefined : undefined
	const complete = state.done === true
	return (
		<ExerciseResults
			queryResult={preview?.results}
			queryError={undefined}
			hasExecuted={!!preview}
			isComplete={complete}
			datasetSize={runtime.datasetSize}
			onDatasetSizeChange={runtime.setDatasetSize}
			datasetWarning={preview?.datasetWarning}
		/>
	)
}

export function createSQLProblem(
	Problem: ComponentType<MonoExerciseProblemProps>,
) {
	return function SQLExerciseProblem({ parameters }: MonoExerciseProblemProps) {
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
