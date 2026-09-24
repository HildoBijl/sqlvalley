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

export interface ComparisonResult {
	correct: boolean
	report: ComparisonReport
}

export type ComparisonReport =
	| { reason: 'correct' | 'empty-result' | 'empty-expected-result' | 'column-order' }
	| { reason: 'column-count'; input: number; expected: number; missing: string[]; extra: string[] }
	| { reason: 'row-count'; input: number; expected: number }
	| { reason: 'column-names'; missing: string[]; extra: string[] }
	| { reason: 'ordered-column-values' | 'unmatched-column-values'; columns: string[] }
	| { reason: 'surplus-column-match'; columns: string[]; matchingExpectedColumnCount: number }
	| { reason: 'row-values'; differenceCount: number; differences: { index: number; row: string[] }[]; ordered: boolean }
