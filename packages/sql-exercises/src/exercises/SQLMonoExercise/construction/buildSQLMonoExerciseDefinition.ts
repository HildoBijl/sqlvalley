import { type MonoExerciseMetadata, type MonoExerciseSpec, buildMonoExercise } from '@step-wise/input-exercises'
import type { ComparisonOptions } from '@sqlvalley/sql-grading'
import type { DatabaseHandle } from '@sqlvalley/sql'

import { sqlDatasetSizes } from '../../../datasetSizes'
import { ensureSqlModuleContext } from '../../../sqlModuleProvider'
import { sqlValueTypes } from '../../../sqlInput'
import { gradeSqlQuery } from './gradeSqlQuery'

export type SQLMonoExerciseDefinitionSpec<Parameters extends Record<string, unknown> = Record<string, never>> = {
	metadata?: MonoExerciseMetadata
	generateParameters?: MonoExerciseSpec<Parameters, { query: string }, unknown, unknown>['generateParameters']
	comparisonOptions?: ComparisonOptions
} & (
	| { solution: string; getSolution?: never }
	| { solution?: never; getSolution: NonNullable<MonoExerciseSpec<Parameters, { query: string }, unknown, unknown>['getSolution']> }
)

// Build the SQL logic on top of the upstream mono-exercise reducer.
export function buildSQLMonoExerciseDefinition<Parameters extends Record<string, unknown> = Record<string, never>>(spec: SQLMonoExerciseDefinitionSpec<Parameters>) {
	return buildMonoExercise<Parameters, { query: string }, unknown, unknown>({
		metadata: spec.metadata ?? {},

		valueTypes: sqlValueTypes,

		generateParameters: spec.generateParameters,

		getSolution: spec.getSolution ?? (() => ({ query: spec.solution })),

		checkInput: async ({ input, solution, context }) => {
			let handle: DatabaseHandle | undefined
			try {
				// Check that all parameters and the database is present.
				if (!solution || !solution.query) throw new Error('Missing SQL exercise solution.')
				if (typeof input.query !== 'string') throw new Error('Invalid SQL query value.')
				handle = ensureSqlModuleContext(context).getGradingDatabase(sqlDatasetSizes.full)
				if (!handle.database) throw handle.error ?? new Error('Database is not ready for verification.')

				// Grade the query according to the given options.
				const result = gradeSqlQuery({ input: input.query, expected: solution.query, database: handle.database, comparisonOptions: spec.comparisonOptions })
				return { correct: result.correct, report: { query: result } }
			} catch {
				return { correct: false, report: { query: { correct: false, result: { reason: 'grading-error' } } } }
			} finally {
				handle?.reset() // Restore the grading data after both successful and failed checks.
			}
		},
	})
}
