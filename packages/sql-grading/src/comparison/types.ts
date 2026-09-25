import type { ComparisonOptions, ComparisonMismatch, SqlQueryResult } from '../types'

export interface ComparisonContext {
	input: SqlQueryResult
	expected: SqlQueryResult
	options: Required<ComparisonOptions>
}

export interface ColumnComparisonResult {
	mismatch?: ComparisonMismatch
	columnMappings: Iterable<readonly number[]>
}
