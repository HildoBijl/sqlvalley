import type { ComponentType } from 'react'

import type { ExerciseMetadata } from '@step-wise/exercise-definition'
import type { ExerciseId, ExerciseVersion } from '@sqlvalley/exercise-instances'
import type { CompareOptions } from '@sqlvalley/sql-grading'
import type { MonoExerciseProblemProps, MonoExerciseSolutionProps } from '@sqlvalley/input-exercise-components'

export interface MonoSQLExerciseDefinitionSpec<Parameters extends Record<string, unknown>> {
	exerciseId: ExerciseId
	version?: ExerciseVersion
	skill?: ExerciseMetadata['skill']
	setup?: ExerciseMetadata['setup']
	generateParameters: (moduleContext: unknown) => Parameters | Promise<Parameters>
	solution: string | ((parameters: Parameters) => string)
	comparisonOptions?: CompareOptions
}

export interface MonoSQLExerciseSpec<Parameters extends Record<string, unknown>> extends MonoSQLExerciseDefinitionSpec<Parameters> {
	Problem: ComponentType<MonoExerciseProblemProps>
	Solution: ComponentType<MonoExerciseSolutionProps>
}
