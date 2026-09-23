/**
 * Types and interfaces for query result grading.
 */

export interface ComparisonResult {
	match: boolean;
	feedback: string;
	report: ComparisonReport;
}

export interface CompareOptions {
	requireEqualColumnOrder?: boolean;
	requireEqualColumnNames?: boolean;
	ignoreRowOrder?: boolean;
	caseSensitive?: boolean;
}

export const DEFAULT_OPTIONS: Required<CompareOptions> = {
	requireEqualColumnOrder: false,
	requireEqualColumnNames: false,
	ignoreRowOrder: true,
	caseSensitive: false,
};

export type ComparisonReport =
	| { reason: 'correct' | 'empty-result' | 'column-order' }
	| { reason: 'column-count' | 'row-count'; actual: number; expected: number }
	| { reason: 'column-names'; missing: string[]; extra: string[] }
	| { reason: 'column-values'; columns: string[] }
	| { reason: 'row-values'; differences: { index: number; row: string }[]; ordered: boolean }
