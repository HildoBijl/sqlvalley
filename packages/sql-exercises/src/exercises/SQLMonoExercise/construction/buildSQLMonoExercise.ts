import type { ExerciseId } from '@sqlvalley/exercise-instances'
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { type SQLMonoExerciseDefinitionSpec, buildSQLMonoExerciseDefinition } from './buildSQLMonoExerciseDefinition'
import { type SQLMonoExerciseComponentSpec, buildSQLMonoExerciseComponent } from './buildSQLMonoExerciseComponent'

export interface SQLMonoExerciseSpec<Parameters extends Record<string, unknown> = Record<string, never>> {
	exerciseId: ExerciseId
	definition: SQLMonoExerciseDefinitionSpec<Parameters>
	component: SQLMonoExerciseComponentSpec<Parameters>
}

export function buildSQLMonoExercise<Parameters extends Record<string, unknown> = Record<string, never>>({ exerciseId, definition, component }: SQLMonoExerciseSpec<Parameters>): ExerciseRegistration {
	return {
		exerciseId,
		definition: buildSQLMonoExerciseDefinition(definition),
		Component: buildSQLMonoExerciseComponent(component),
	}
}
