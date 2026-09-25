import type { ComparisonOptions, ComparisonResult, SqlQueryResult } from '../types'

export interface ComparisonContext {
	input: SqlQueryResult
	expected: SqlQueryResult
	options: Required<ComparisonOptions>
}

export interface ColumnComparisonResult {
	error?: ComparisonResult
	columnMappings: Iterable<readonly number[]>
}
