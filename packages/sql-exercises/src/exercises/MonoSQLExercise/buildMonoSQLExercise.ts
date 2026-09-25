import type { ExerciseMetadata } from '@step-wise/exercise-definition'
import { buildMonoExercise } from '@step-wise/input-exercises'
import type { ExerciseId, ExerciseVersion } from '@sqlvalley/exercise-instances'
import type { ComparisonOptions } from '@sqlvalley/sql-grading'
import type { DatabaseHandle } from '@sqlvalley/sql'

import { ensureSqlModuleContext } from '../../sqlModuleProvider'
import { sqlValueTypes } from '../../sqlInput'
import { gradeSqlQuery } from './gradeSqlQuery'

export interface MonoSQLExerciseDefinitionSpec<Parameters extends Record<string, unknown>> {
	exerciseId: ExerciseId
	version?: ExerciseVersion
	skill?: ExerciseMetadata['skill']
	setup?: ExerciseMetadata['setup']
	generateParameters?: (context: unknown) => Parameters | Promise<Parameters>
	solution: string | ((parameters: Parameters) => string)
	comparisonOptions?: ComparisonOptions
}

// Builds the logical definition; rendering is paired separately by createMonoSQLExercise.
export function buildMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseDefinitionSpec<Parameters>) {
	const { generateParameters } = spec
	return buildMonoExercise<Parameters, { query: string }, unknown, unknown>({
		// General exercise data.
		metadata: {
			version: spec.version,
			skill: spec.skill,
			setup: spec.setup,
		},
		valueTypes: sqlValueTypes,

		// 
		generateParameters: generateParameters ? ({ context }) => generateParameters(context) : undefined,

		getSolution: ({ parameters }) => ({ query: typeof spec.solution === 'function' ? spec.solution(parameters) : spec.solution }),

		checkInput: async ({ input, solution, context }) => {
			let handle: DatabaseHandle | undefined
			try {
				// Check that all parameters and the database is present.
				if (!solution || !solution.query) throw new Error('Missing SQL exercise solution.')
				if (typeof input.query !== 'string') throw new Error('Invalid SQL query value.')
				handle = ensureSqlModuleContext(context).getGradingDatabase('full')
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
