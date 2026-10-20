import type { ComponentType, FunctionComponent } from 'react'

import { type MonoExerciseProblemProps, type MonoExerciseSolutionProps, type MonoExercisePromptProps, type MonoExercisePayoffProps, MonoExercise } from '@sqlvalley/input-exercise-components'

import { createSQLProblem, SQLExerciseInputArea, SQLExerciseSolution, SQLExerciseInputVisualization } from '../components'

export type SQLExerciseProblemProps<Parameters extends Record<string, unknown>> = Omit<MonoExerciseProblemProps, 'parameters'> & { parameters: Parameters }
export type SQLExerciseSolutionProps<Parameters extends Record<string, unknown>> = Omit<MonoExerciseSolutionProps, 'parameters'> & { parameters: Parameters }
export type SQLExercisePromptProps<Parameters extends Record<string, unknown>> = Omit<MonoExercisePromptProps, 'parameters'> & { parameters: Parameters }
export type SQLExercisePayoffProps<Parameters extends Record<string, unknown>> = Omit<MonoExercisePayoffProps, 'parameters'> & { parameters: Parameters }

export interface SQLMonoExerciseComponentSpec<Parameters extends Record<string, unknown> = Record<string, never>> {
	Problem: ComponentType<SQLExerciseProblemProps<Parameters>>
	Solution?: ComponentType<SQLExerciseSolutionProps<Parameters>>
	Prompt?: ComponentType<SQLExercisePromptProps<Parameters>>
	Payoff?: ComponentType<SQLExercisePayoffProps<Parameters>>
}

export function buildSQLMonoExerciseComponent<Parameters extends Record<string, unknown>>(spec: SQLMonoExerciseComponentSpec<Parameters>): FunctionComponent {
	// Put the component specs in the form for the MonoExercise.
	const componentSpec = {
		Problem: createSQLProblem(spec.Problem as ComponentType<MonoExerciseProblemProps>),
		InputArea: SQLExerciseInputArea,
		Solution: (spec.Solution as ComponentType<MonoExerciseSolutionProps> | undefined) ?? SQLExerciseSolution,
		InputVisualization: SQLExerciseInputVisualization,
		Prompt: spec.Prompt as ComponentType<MonoExercisePromptProps> | undefined,
		Payoff: spec.Payoff as ComponentType<MonoExercisePayoffProps> | undefined,
	}

	// Render the MonoExercise component.
	return function SQLMonoExercise() {
		return <MonoExercise {...componentSpec} />
	}
}
