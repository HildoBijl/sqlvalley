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
