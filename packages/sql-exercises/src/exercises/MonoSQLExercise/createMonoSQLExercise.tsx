import type { ComponentType } from 'react'

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { type MonoExerciseProblemProps, type MonoExerciseSolutionProps, MonoExercise } from '@sqlvalley/input-exercise-components'

import { type MonoSQLExerciseDefinitionSpec, buildMonoSQLExercise } from './buildMonoSQLExercise'
import { createSQLProblem, SQLExerciseInputArea, SQLExerciseInputVisualization, SQLExerciseSolution } from './components'

export interface MonoSQLExerciseSpec<Parameters extends Record<string, unknown>> extends MonoSQLExerciseDefinitionSpec<Parameters> {
	Problem: ComponentType<MonoExerciseProblemProps>
	Solution?: ComponentType<MonoExerciseSolutionProps>
}

export function createMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseSpec<Parameters>): ExerciseRegistration {
	const componentSpec = {
		Problem: createSQLProblem(spec.Problem),
		InputArea: SQLExerciseInputArea,
		InputVisualization: SQLExerciseInputVisualization,
		Solution: spec.Solution ?? SQLExerciseSolution,
	}
	return {
		exerciseId: spec.exerciseId,
		definition: buildMonoSQLExercise(spec),
		Component: () => <MonoExercise {...componentSpec} />,
	}
}
