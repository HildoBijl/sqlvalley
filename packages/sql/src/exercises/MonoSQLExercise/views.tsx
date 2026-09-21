import { Alert } from '@mui/material'

import type { MonoExerciseState } from '@step-wise/input-exercises'
import { type MonoExerciseInputProps, type MonoExerciseOutputProps, useInputField } from '@sqlvalley/input-exercise-components'

import { useSqlPracticeContext } from '../SqlPractice'
import type { MonoSQLCheckResult } from './types'
import { ExerciseDescription } from './components/ExerciseDescription'
import { ExerciseEditor } from './components/ExerciseEditor'
import { ExerciseResults } from './components/ExerciseResults'
import { ExerciseSolution } from './components/ExerciseSolution'

export function SQLExerciseInput<Parameters extends Record<string, unknown>>({
	disabled,
	onSubmit,
}: MonoExerciseInputProps<Parameters, string>) {
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

export function SQLExerciseOutput<Parameters extends Record<string, unknown>>({
	state,
}: MonoExerciseOutputProps<Parameters, string, MonoSQLCheckResult>) {
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
	title: string,
	getProblem: (parameters: Parameters) => string,
) {
	return function SQLExerciseProblem({ parameters }: { parameters: Parameters }) {
		const runtime = useSqlPracticeContext()
		return (
			<ExerciseDescription
				title={title}
				description={getProblem(parameters)}
				tableNames={runtime.tableNames}
			/>
		)
	}
}

export function createSQLSolution<Parameters extends Record<string, unknown>>(
	getSolution: (parameters: Parameters) => string,
) {
	return function SQLExerciseSolution({
		parameters,
	}: {
		parameters: Parameters
		state: MonoExerciseState
	}) {
		return <ExerciseSolution solution={{ query: getSolution(parameters) }} />
	}
}
