import { isPlainDataObject } from '@step-wise/js-utils'
import { type ComparisonReport, getComparisonFeedback } from '@sqlvalley/sql-grading'
import type { FieldFeedbackOptions, InputFeedback } from '@sqlvalley/input-exercise-components'

export type SqlSubmissionReport = {
	correct: boolean
	result: ComparisonReport | { reason: 'invalid-query' | 'execution-error' | 'grading-error' }
}

// Reports persist facts only. Wording is generated using the current application code.
export function getSqlFeedback({ report }: FieldFeedbackOptions): InputFeedback | undefined {
	if (report === undefined) return
	if (!isPlainDataObject(report) || typeof report.correct !== 'boolean' || !isSqlResult(report.result)) throw new Error('Invalid SQL submission report.')
	if (report.correct !== (report.result.reason === 'correct')) throw new Error('Inconsistent SQL submission report.')
	const result = report.result
	switch (result.reason) {
		case 'invalid-query': return { type: 'warning', message: 'Please enter a valid SQL SELECT query before submitting.' }
		case 'execution-error': return { type: 'warning', message: 'Your query could not run on the grading dataset. Please check your query.' }
		case 'grading-error': return { type: 'error', message: 'Unable to check your answer. Please try again.' }
		default: return { type: report.correct ? 'success' : 'error', message: getComparisonFeedback(result) }
	}
}

function isSqlResult(value: unknown): value is SqlSubmissionReport['result'] {
	if (!isPlainDataObject(value)) return false
	switch (value.reason) {
		case 'correct':
		case 'empty-result':
		case 'column-order':
		case 'invalid-query':
		case 'execution-error':
		case 'grading-error': return true
		case 'column-count':
		case 'row-count': return typeof value.actual === 'number' && Number.isSafeInteger(value.actual) && value.actual >= 0 && typeof value.expected === 'number' && Number.isSafeInteger(value.expected) && value.expected >= 0
		case 'column-names': return isStringArray(value.missing) && isStringArray(value.extra)
		case 'column-values': return isStringArray(value.columns)
		case 'row-values': return typeof value.ordered === 'boolean' && Array.isArray(value.differences) && value.differences.every(item => isPlainDataObject(item) && typeof item.index === 'number' && Number.isSafeInteger(item.index) && item.index >= 0 && typeof item.row === 'string')
		default: return false
	}
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every(item => typeof item === 'string')
}
