import type { ComponentType } from 'react'

import { useDatasetSize } from '@sqlvalley/sql'
import { type MonoExerciseProblemProps, type MonoExerciseInputAreaProps, type MonoExerciseInputVisualizationProps, useInputExerciseContext, useSolution } from '@sqlvalley/input-exercise-components'

import { useModuleCompletionSchema } from '../../sqlModuleProvider'
import { type SqlQueryValidationReport, SqlInput } from '../../sqlInput'
import { useSmallDatasetWarning } from './useSmallDatasetWarning'
import { ExerciseDescription } from './components/ExerciseDescription'
import { ExerciseResults } from './components/ExerciseResults'
import { ExerciseSolution } from './components/ExerciseSolution'

export function SQLExerciseInputArea({
	disabled,
	onSubmit,
}: MonoExerciseInputAreaProps) {
	return <SqlInput name="query" disabled={disabled} onSubmit={onSubmit} />
}

export function SQLExerciseInputVisualization({
	state,
}: MonoExerciseInputVisualizationProps) {
	const [datasetSize, setDatasetSize] = useDatasetSize()
	const { getFieldValidation } = useInputExerciseContext()
	const validation = getFieldValidation('query')
	const preview = validation.status === 'valid' ? validation.report as SqlQueryValidationReport | undefined : undefined
	const datasetWarning = useSmallDatasetWarning(preview)
	const complete = state.done === true
	return <ExerciseResults
		queryResult={preview?.results}
		queryError={undefined}
		hasExecuted={!!preview}
		isComplete={complete}
		datasetSize={datasetSize}
		onDatasetSizeChange={setDatasetSize}
		datasetWarning={datasetWarning}
	/>
}

export function createSQLProblem(
	Problem: ComponentType<MonoExerciseProblemProps>,
) {
	return function SQLExerciseProblem({ parameters }: MonoExerciseProblemProps) {
		const schema = useModuleCompletionSchema()
		return <ExerciseDescription
			description={<Problem parameters={parameters} />}
			tableNames={Object.keys(schema).sort()}
		/>
	}
}

export function SQLExerciseSolution() {
	const solution = useSolution()
	if (!solution || typeof solution.query !== 'string') throw new Error('A SQL solution must contain a query string.')
	return <ExerciseSolution solution={{ query: solution.query }} />
}
