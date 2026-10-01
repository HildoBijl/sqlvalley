import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { type SQLMonoExerciseSpec, buildSQLMonoExercise } from '@sqlvalley/sql-exercises'

// Each spec checks its own parameters; this collection can contain different parameter types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModuleExerciseSpec = SQLMonoExerciseSpec<any>

// Apply module defaults before constructing reducers, without changing the imported specs.
export function buildModuleExercises(specs: readonly ModuleExerciseSpec[], skillId: string): ExerciseRegistration[] {
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
