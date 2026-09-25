import { isPlainDataObject, isString } from '@step-wise/js-utils'

/*
 * Query shape.
 */

export interface SqlQueryResult {
	columns: readonly string[]
	values: readonly (readonly unknown[])[]
}

/*
 * Comparison options.
 */

export interface ComparisonOptions {
	requireEqualColumnOrder?: boolean
	requireEqualColumnNames?: boolean
	requireEqualRowOrder?: boolean
	caseSensitiveColumnNames?: boolean
	caseSensitiveValues?: boolean
}

/*
 * Comparison output.
 */

// Binary and non-JSON scalar values use explicit tags to preserve their types in storage.
export type ReportValue =
	| string | number | boolean | null
	| { type: 'binary'; value: number[] }
	| { type: 'number'; value: 'NaN' | 'Infinity' | '-Infinity' }
	| { type: 'undefined' }

export type ComparisonResult =
	| { correct: true; report: { reason: 'correct' } }
	| ComparisonMismatch

export interface ComparisonMismatch {
	correct: false
	report: ComparisonMismatchReport
}

export type ComparisonReport = { reason: 'correct' } | ComparisonMismatchReport

export type ComparisonMismatchReport =
	| { reason: 'empty-result' | 'empty-expected-result' | 'column-order' }
	| ({ reason: 'column-count'; input: number; expected: number } & (
		| { missing: string[]; extra: string[] }
		| { missing?: never; extra?: never }
	))
	| { reason: 'row-count'; input: number; expected: number }
	| { reason: 'column-names'; missing: string[]; extra: string[] }
	| { reason: 'ordered-column-values' | 'unmatched-column-values'; columns: string[] }
	| { reason: 'surplus-column-match'; columns: string[]; matchingExpectedColumnCount: number }
	| { reason: 'row-values'; differenceCount: number; differences: { index: number; row: ReportValue[] }[]; ordered: boolean }

// Validate report data received from persistence or another package.
export function isComparisonReport(value: unknown): value is ComparisonReport {
	if (!isPlainDataObject(value)) return false
	switch (value.reason) {
		case 'correct':
		case 'empty-result':
		case 'empty-expected-result':
		case 'column-order': return true
		case 'row-count': return isCount(value.input) && isCount(value.expected)
		case 'column-count': return isCount(value.input) && isCount(value.expected)
			&& ((value.missing === undefined && value.extra === undefined) || (isStringArray(value.missing) && isStringArray(value.extra)))
		case 'column-names': return isStringArray(value.missing) && isStringArray(value.extra)
		case 'ordered-column-values':
		case 'unmatched-column-values': return isStringArray(value.columns)
		case 'surplus-column-match': return isStringArray(value.columns) && isCount(value.matchingExpectedColumnCount)
		case 'row-values': return isCount(value.differenceCount) && value.differenceCount > 0
			&& typeof value.ordered === 'boolean' && Array.isArray(value.differences)
			&& value.differences.length <= value.differenceCount && value.differences.every(isRowDifference)
		default: return false
	}
}

const isCount = (value: unknown): value is number =>
	typeof value === 'number' && Number.isSafeInteger(value) && value >= 0

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every(isString)

function isRowDifference(value: unknown): boolean {
	return isPlainDataObject(value) && isCount(value.index) && Array.isArray(value.row) && value.row.every(isReportValue)
}

export function isReportValue(value: unknown): value is ReportValue {
	if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
	if (typeof value === 'number') return Number.isFinite(value)
	if (!isPlainDataObject(value)) return false
	if (value.type === 'undefined') return true
	if (value.type === 'number') return value.value === 'NaN' || value.value === 'Infinity' || value.value === '-Infinity'
	return value.type === 'binary' && Array.isArray(value.value) && value.value.every(byte => typeof byte === 'number' && Number.isInteger(byte) && byte >= 0 && byte <= 255)
}
