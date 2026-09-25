import type { ComponentType, FunctionComponent } from 'react'

import { type MonoExerciseProblemProps, type MonoExerciseSolutionProps, MonoExercise } from '@sqlvalley/input-exercise-components'

import { createSQLProblem, SQLExerciseInputArea, SQLExerciseInputVisualization, SQLExerciseSolution } from '../components'

export interface SQLMonoExerciseComponentSpec {
	Problem: ComponentType<MonoExerciseProblemProps>
	Solution?: ComponentType<MonoExerciseSolutionProps>
}

export function buildSQLMonoExerciseComponent(spec: SQLMonoExerciseComponentSpec): FunctionComponent {
	// Set up the components as expected by the MonoExercise component.
	const componentSpec = {
		Problem: createSQLProblem(spec.Problem),
		InputArea: SQLExerciseInputArea,
		InputVisualization: SQLExerciseInputVisualization,
		Solution: spec.Solution ?? SQLExerciseSolution,
	}

	// Render the MonoExercise component.
	return function SQLMonoExercise() {
		return <MonoExercise {...componentSpec} />
	}
}
