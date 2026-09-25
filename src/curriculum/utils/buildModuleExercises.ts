import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { type SQLMonoExerciseSpec, buildSQLMonoExercise } from '@sqlvalley/sql-exercises'

// Apply module defaults before constructing reducers, without changing the imported specs.
export function buildModuleExercises(specs: readonly SQLMonoExerciseSpec[], skillId: string): ExerciseRegistration[] {
	return specs.map(spec => buildSQLMonoExercise({
		...spec,
		definition: {
			...spec.definition,
			metadata: {
				...spec.definition.metadata,
				skill: spec.definition.metadata?.skill ?? skillId,
			},
		},
	}))
}
