import { buildMonoExercise } from '@step-wise/input-exercises'

import { validateSqlInput } from '@sqlvalley/sql-grading'

import type { DatabaseHandle } from '../../databaseProvider'
import { ensureSqlModuleContext } from '../../sqlModuleProvider'
import type { MonoSQLExerciseSpec } from './types'
import { fromRawInput, resolveValue, sqlValueTypes } from './input'
import { gradeSqlQuery } from './gradeSqlQuery'

// Builds the logical definition; rendering is paired separately by createMonoSQLExercise.
export function buildMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseSpec<Parameters>) {
	const exercise = buildMonoExercise<Parameters, { query: string }, unknown, unknown>({
		metadata: { version: spec.version, skill: spec.skill, setup: spec.setup },
		valueTypes: sqlValueTypes,
		generateParameters: ({ context }) => spec.generateParameters(context),
		getSolution: ({ parameters }) => ({ query: resolveValue(spec.solution, parameters) }),
		checkInput: async ({ rawInput, solution, context }) => {
			let handle: DatabaseHandle | undefined
			try {
				if (!solution) throw new Error('Missing SQL exercise solution.')
				const input = fromRawInput(rawInput)
				const validation = validateSqlInput(input)
				if (!validation.ok) return { correct: false, report: { message: validation.message ?? 'Please double-check your input before submitting.', type: 'warning' } }
				handle = ensureSqlModuleContext(context).getGradingDatabase('full')
				if (!handle.database) throw handle.error ?? new Error('Database is not ready for verification.')
				const result = gradeSqlQuery({ query: input, solution: solution.query, database: handle.database, comparisonOptions: spec.comparisonOptions })
				return {
					correct: result.correct,
					report: {
						message: result.feedback ?? (result.correct ? 'Correct!' : 'Not quite right. Try again.'),
						type: result.feedbackType,
						result: { correct: result.correct, feedbackType: result.feedbackType, ...(result.feedback !== undefined ? { feedback: result.feedback } : {}) },
					},
				}
			} catch (error) {
				return { correct: false, report: { message: error instanceof Error ? error.message : 'Unable to check your answer. Please try again.', type: 'error' } }
			} finally {
				// Restore the grading data after both successful and failed checks.
				handle?.reset()
			}
		},
	})
	return { metadata: exercise.metadata, generateParameters: exercise.generateParameters, getInitialState: exercise.getInitialState, processSoloAction: exercise.processSoloAction }
}
