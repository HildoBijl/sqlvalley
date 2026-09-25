import type { ComponentType, FunctionComponent } from 'react'

import { type MonoExerciseProblemProps, type MonoExerciseSolutionProps, MonoExercise } from '@sqlvalley/input-exercise-components'

import { createSQLProblem, SQLExerciseInputArea, SQLExerciseInputVisualization, SQLExerciseSolution } from '../components'

export type SQLExerciseProblemProps<Parameters extends Record<string, unknown>> = Omit<MonoExerciseProblemProps, 'parameters'> & { parameters: Parameters }
export type SQLExerciseSolutionProps<Parameters extends Record<string, unknown>> = Omit<MonoExerciseSolutionProps, 'parameters'> & { parameters: Parameters }

export interface SQLMonoExerciseComponentSpec<Parameters extends Record<string, unknown> = Record<string, never>> {
	Problem: ComponentType<SQLExerciseProblemProps<Parameters>>
	Solution?: ComponentType<SQLExerciseSolutionProps<Parameters>>
}

export function buildSQLMonoExerciseComponent<Parameters extends Record<string, unknown>>(spec: SQLMonoExerciseComponentSpec<Parameters>): FunctionComponent {
	// The registration pairs these components with the generator that produces their parameters.
	// Adapt once to the generic renderer rather than requiring casts in exercise components.
	const componentSpec = {
		Problem: createSQLProblem(spec.Problem as ComponentType<MonoExerciseProblemProps>),
		InputArea: SQLExerciseInputArea,
		InputVisualization: SQLExerciseInputVisualization,
		Solution: (spec.Solution as ComponentType<MonoExerciseSolutionProps> | undefined) ?? SQLExerciseSolution,
	}

	// Render the MonoExercise component.
	return function SQLMonoExercise() {
		return <MonoExercise {...componentSpec} />
	}
}
