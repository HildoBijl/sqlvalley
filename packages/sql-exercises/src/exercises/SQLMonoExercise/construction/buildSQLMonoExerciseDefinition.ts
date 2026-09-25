import { type MonoExerciseMetadata, type MonoExerciseSpec, buildMonoExercise } from '@step-wise/input-exercises'
import type { ComparisonOptions } from '@sqlvalley/sql-grading'
import type { DatabaseHandle } from '@sqlvalley/sql'

import { sqlDatasetSizes } from '../../../datasetSizes'
import { type SqlModuleContext, ensureSqlModuleContext } from '../../../sqlModuleProvider'
import { sqlValueTypes } from '../../../sqlInput'
import { gradeSqlQuery } from './gradeSqlQuery'

export type SQLMonoExerciseDefinitionSpec<Parameters extends Record<string, unknown> = Record<string, never>> = {
	metadata?: MonoExerciseMetadata
	generateParameters?: MonoExerciseSpec<Parameters, { query: string }, unknown, SqlModuleContext>['generateParameters']
	comparisonOptions?: ComparisonOptions
} & (
	| { solution: string; getSolution?: never }
	| { solution?: never; getSolution: NonNullable<MonoExerciseSpec<Parameters, { query: string }, unknown, SqlModuleContext>['getSolution']> }
)

// Build the SQL logic on top of the upstream mono-exercise reducer.
export function buildSQLMonoExerciseDefinition<Parameters extends Record<string, unknown> = Record<string, never>>(spec: SQLMonoExerciseDefinitionSpec<Parameters>) {
	const { generateParameters, getSolution } = spec
	return buildMonoExercise<Parameters, { query: string }, unknown, unknown>({
		metadata: spec.metadata ?? {},

		valueTypes: sqlValueTypes,

		generateParameters: generateParameters ? data => generateParameters({ ...data, context: ensureSqlModuleContext(data.context) }) : undefined,

		getSolution: getSolution ? data => getSolution({ ...data, context: ensureSqlModuleContext(data.context) }) : () => ({ query: spec.solution }),

		checkInput: async ({ input, solution, context }) => {
			let handle: DatabaseHandle | undefined
			try {
				// Check that all parameters and the database is present.
				if (!solution || !solution.query) throw new Error('Missing SQL exercise solution.')
				if (typeof input.query !== 'string') throw new Error('Invalid SQL query value.')
				const sqlContext = ensureSqlModuleContext(context)
				handle = sqlContext.getGradingDatabaseHandle(sqlDatasetSizes.full)
				const database = sqlContext.getGradingDatabase(sqlDatasetSizes.full)

				// Grade the query according to the given options.
				const result = gradeSqlQuery({ input: input.query, expected: solution.query, database, comparisonOptions: spec.comparisonOptions })
				return { correct: result.correct, report: { query: result } }
			} catch {
				return { correct: false, report: { query: { correct: false, result: { reason: 'grading-error' } } } }
			} finally {
				handle?.reset() // Restore the grading data after both successful and failed checks.
			}
		},
	})
}
