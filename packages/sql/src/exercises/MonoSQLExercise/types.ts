import type { ExerciseId, ExerciseVersion } from '@sqlvalley/exercise-instances'
import type { CompareOptions } from '@sqlvalley/sql-grading'
import type { MonoExerciseFeedbackType } from '@sqlvalley/input-exercise-components'

export interface MonoSQLExerciseSpec<Parameters extends Record<string, unknown>> {
	exerciseId: ExerciseId
	version?: ExerciseVersion
	generateParameters: (moduleContext: unknown) => Parameters | Promise<Parameters>
	problem: string | ((parameters: Parameters) => string)
	solution: string | ((parameters: Parameters) => string)
	comparisonOptions?: CompareOptions
	title?: string
}

export interface MonoSQLCheckResult {
	correct: boolean
	feedback?: string
	feedbackType: MonoExerciseFeedbackType
}
