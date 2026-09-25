import { buildMonoExercise } from '@step-wise/input-exercises'
import type { DatabaseHandle } from '@sqlvalley/sql'

import { ensureSqlModuleContext } from '../../sqlModuleProvider'
import { sqlValueTypes } from '../../sqlInput'
import type { MonoSQLExerciseDefinitionSpec } from './types'
import { gradeSqlQuery } from './gradeSqlQuery'

// Builds the logical definition; rendering is paired separately by createMonoSQLExercise.
export function buildMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseDefinitionSpec<Parameters>) {
	return buildMonoExercise<Parameters, { query: string }, unknown, unknown>({
		metadata: { version: spec.version, skill: spec.skill, setup: spec.setup },
		valueTypes: sqlValueTypes,
		generateParameters: ({ context }) => spec.generateParameters(context),
		getSolution: ({ parameters }) => ({ query: typeof spec.solution === 'function' ? spec.solution(parameters) : spec.solution }),
		checkInput: async ({ input, solution, context }) => {
			let handle: DatabaseHandle | undefined
			try {
				if (!solution) throw new Error('Missing SQL exercise solution.')
				if (typeof input.query !== 'string') throw new Error('Invalid SQL query value.')
				handle = ensureSqlModuleContext(context).getGradingDatabase('full')
				if (!handle.database) throw handle.error ?? new Error('Database is not ready for verification.')
				const result = gradeSqlQuery({ query: input.query, solution: solution.query, database: handle.database, comparisonOptions: spec.comparisonOptions })
				return { correct: result.correct, report: { query: result } }
			} catch {
				return { correct: false, report: { query: { correct: false, result: { reason: 'grading-error' } } } }
			} finally {
				// Restore the grading data after both successful and failed checks.
				handle?.reset()
			}
		},
	})
}
