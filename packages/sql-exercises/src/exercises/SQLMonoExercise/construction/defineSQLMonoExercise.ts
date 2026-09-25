import type { GenerateExerciseParametersInput } from '@step-wise/exercise-definition'

import type { SqlModuleContext } from '../../../sqlModuleProvider'
import type { SQLMonoExerciseSpec } from './buildSQLMonoExercise'

// Keep specs unbuilt while deriving all parameter types from the generator.
export function defineSQLMonoExercise<Generate extends (options: GenerateExerciseParametersInput<SqlModuleContext>) => Record<string, unknown> | Promise<Record<string, unknown>>>(spec: {
	exerciseId: SQLMonoExerciseSpec['exerciseId']
	definition: { generateParameters: Generate } & (
		| { solution: string; getSolution?: never }
		| { solution?: never; getSolution: NonNullable<SQLMonoExerciseSpec<Awaited<ReturnType<Generate>>>['definition']['getSolution']> }
	) & Pick<SQLMonoExerciseSpec['definition'], 'metadata' | 'comparisonOptions'>
	component: SQLMonoExerciseSpec<Awaited<ReturnType<Generate>>>['component']
}): SQLMonoExerciseSpec<Awaited<ReturnType<Generate>>>
export function defineSQLMonoExercise(spec: SQLMonoExerciseSpec & { definition: { generateParameters?: never } }): SQLMonoExerciseSpec
export function defineSQLMonoExercise(spec: unknown): unknown {
	return spec
}
