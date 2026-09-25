import { isPlainDataObject } from '@step-wise/js-utils'
import type { ComparisonReport, ReportValue } from '@sqlvalley/sql-grading'
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
		case 'empty-expected-result':
		case 'column-order':
		case 'invalid-query':
		case 'execution-error':
		case 'grading-error': return true
		case 'row-count': return typeof value.input === 'number' && Number.isSafeInteger(value.input) && value.input >= 0 && typeof value.expected === 'number' && Number.isSafeInteger(value.expected) && value.expected >= 0
		case 'column-count': return typeof value.input === 'number' && Number.isSafeInteger(value.input) && value.input >= 0 && typeof value.expected === 'number' && Number.isSafeInteger(value.expected) && value.expected >= 0 && ((value.missing === undefined && value.extra === undefined) || (isStringArray(value.missing) && isStringArray(value.extra)))
		case 'column-names': return isStringArray(value.missing) && isStringArray(value.extra)
		case 'ordered-column-values':
		case 'unmatched-column-values': return isStringArray(value.columns)
		case 'surplus-column-match': return isStringArray(value.columns) && typeof value.matchingExpectedColumnCount === 'number' && Number.isSafeInteger(value.matchingExpectedColumnCount) && value.matchingExpectedColumnCount >= 0
		case 'row-values': return typeof value.differenceCount === 'number' && Number.isSafeInteger(value.differenceCount) && value.differenceCount > 0 && typeof value.ordered === 'boolean' && Array.isArray(value.differences) && value.differences.length <= value.differenceCount && value.differences.every(item => isPlainDataObject(item) && typeof item.index === 'number' && Number.isSafeInteger(item.index) && item.index >= 0 && Array.isArray(item.row) && item.row.every(isReportValue))
		default: return false
	}
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function getComparisonFeedback(report: ComparisonReport): string {
	switch (report.reason) {
		case 'correct': return 'Correct!'
		case 'empty-result': return 'Your output seems to be empty. Some records were expected here, so something has gone wrong.'
		case 'empty-expected-result': return 'The expected query did not return a result. Please report this exercise so it can be fixed.'
		case 'column-order': return "It seems like you didn't give the columns in the required order. Please check the column order."
		case 'column-count': return getColumnCountFeedback(report)
		case 'row-count': return report.input > report.expected
			? 'You seem to have more rows than expected. Did you set up your filters well enough?'
			: 'You seem to have fewer rows than expected. Check that you included all required entries.'
		case 'column-names': return getColumnNameFeedback(report.missing, report.extra)
		case 'ordered-column-values': return report.columns.length === 1
			? `The values in column "${report.columns[0]}" do not match the expected column in that position.`
			: `The values in ${formatQuotedList(report.columns)} do not match the expected columns in those positions.`
		case 'unmatched-column-values': return report.columns.length === 1
			? `The values in column "${report.columns[0]}" do not match any expected column.`
			: `The values in ${formatQuotedList(report.columns)} do not match any expected columns.`
		case 'surplus-column-match': return report.matchingExpectedColumnCount === 1
			? `The columns ${formatQuotedList(report.columns)} all match the same expected column, so one of them cannot be mapped correctly.`
			: `The columns ${formatQuotedList(report.columns)} match only ${report.matchingExpectedColumnCount} expected columns, so at least one cannot be mapped correctly.`
		case 'row-values': return `${report.differenceCount === 1 ? 'One row does' : `${report.differenceCount} rows do`} not match the expected values.${formatSampleDifferences(report.differences, report.ordered)}`
	}
}

function getColumnNameFeedback(missing: string[], extra: string[]): string {
	if (missing.length === 1 && extra.length === 1) return `Your output seems to be missing a column. I expected there to be one named "${missing[0]}". I did see "${extra[0]}" though, so check spelling.`
	if (missing.length === 1) return `Your output seems to be missing a column. I expected there to be one named "${missing[0]}".`
	if (missing.length > 1) return `Your output seems to be missing some columns. Check that you have ${formatQuotedList(missing)} in your result.`
	return 'Your output seems to have more columns than was expected. Did you accidentally select too many columns?'
}

function formatQuotedList(items: string[], limit = 6): string {
	const quoted = items.map(item => `"${item}"`)
	return quoted.length <= limit ? quoted.join(', ') : `${quoted.slice(0, limit).join(', ')} (and ${quoted.length - limit} more)`
}

function getColumnCountFeedback(report: Extract<ComparisonReport, { reason: 'column-count' }>): string {
	if (report.missing === undefined && report.extra === undefined) return `Your query returns ${report.input} ${report.input === 1 ? 'column' : 'columns'}, but ${report.expected} ${report.expected === 1 ? 'is' : 'are'} expected.`
	if (report.input > report.expected) {
		const detail = report.extra && report.extra.length > 0 ? ` The superfluous columns appear to be ${formatQuotedList(report.extra)}.` : ''
		return `Your output seems to have more columns than was expected.${detail}`
	}
	const detail = report.missing && report.missing.length > 0 ? ` The missing columns appear to be ${formatQuotedList(report.missing)}.` : ''
	return `Your output seems to have fewer columns than was expected.${detail}`
}

function formatSampleDifferences(differences: Array<{ index: number; row: ReportValue[] }>, includeIndex: boolean, limit = 2): string {
	if (differences.length === 0) return ''
	const samples = differences.slice(0, limit)
	const label = samples.length === 1 ? 'Example' : 'Examples'
	const formatted = samples.map(sample => `${includeIndex ? `row ${sample.index + 1}: ` : ''}(${sample.row.map(formatReportValue).join(', ')})`)
	return ` ${label}: ${formatted.join('; ')}`
}

function isReportValue(value: unknown): value is ReportValue {
	if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
	if (typeof value === 'number') return Number.isFinite(value)
	if (!isPlainDataObject(value)) return false
	if (value.type === 'undefined') return true
	if (value.type === 'number') return value.value === 'NaN' || value.value === 'Infinity' || value.value === '-Infinity'
	return value.type === 'binary' && Array.isArray(value.value) && value.value.every(byte => typeof byte === 'number' && Number.isInteger(byte) && byte >= 0 && byte <= 255)
}

function formatReportValue(value: ReportValue): string {
	if (value === null) return 'NULL'
	if (typeof value === 'string') return JSON.stringify(value)
	if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
	if (typeof value === 'number') return String(value)
	if (value.type === 'undefined') return 'undefined'
	if (value.type === 'number') return value.value
	return `X'${value.value.map(byte => byte.toString(16).padStart(2, '0')).join('')}'`
}
