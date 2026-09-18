import { buildMonoExercise } from '@step-wise/input-exercises'

import { validateSqlInput } from '@sqlvalley/sql-grading'

import type { SqlModuleContext } from '../SqlModule'
import type { MonoSQLExerciseSpec } from './types'
import { fromRawInput, resolveValue, sqlValueTypes } from './input'

// Builds the logical definition; rendering is paired separately by createMonoSQLExercise.
export function buildMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseSpec<Parameters>) {
	const exercise = buildMonoExercise<Parameters, { query: string }, unknown, unknown>({
		metadata: { version: spec.version },
		valueTypes: sqlValueTypes,
		generateParameters: ({ context }) => spec.generateParameters(context),
		getSolution: ({ parameters }) => ({ query: resolveValue(spec.solution, parameters) }),
		checkInput: async ({ rawInput, solution, context }) => {
			try {
				if (!solution) throw new Error('Missing SQL exercise solution.')
				const input = fromRawInput(rawInput)
				const validation = validateSqlInput(input)
				if (!validation.ok) return { correct: false, report: { message: validation.message ?? 'Please double-check your input before submitting.', type: 'warning' } }
				const result = await (context as SqlModuleContext).grade(input, solution.query, spec.comparisonOptions)
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
			}
		},
	})
	return { metadata: exercise.metadata, generateParameters: exercise.generateParameters, getInitialState: exercise.getInitialState, processSoloAction: exercise.processSoloAction }
}
