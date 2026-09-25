import { mergeDefaults } from '@step-wise/js-utils'

import type { ComparisonOptions, ComparisonResult, SqlQueryResult } from './types'
import { type ComparisonContext, compareColumnCount, compareColumns, compareRowCount, compareRows } from './comparison'

const defaultComparisonOptions: Required<ComparisonOptions> = {
	requireEqualColumnOrder: false,
	requireEqualColumnNames: false,
	requireEqualRowOrder: false,
	caseSensitiveColumnNames: false,
	caseSensitiveValues: false,
}

// Compare two query results and report the first unmet requirement.
export function compareQueryResults(
	input: SqlQueryResult | undefined,
	expected: SqlQueryResult | undefined,
	options: ComparisonOptions = {},
): ComparisonResult {
	// Evaluate potential empty cases.
	if (!input && !expected) return { correct: true, report: { reason: 'correct' } }
	if (!input) return { correct: false, report: { reason: 'empty-result' } }
	if (!expected) return { correct: false, report: { reason: 'empty-expected-result' } }

	// Gather all data into a comparison context to easily pass around.
	const context: ComparisonContext = { input, expected, options: mergeDefaults({ ...options }, defaultComparisonOptions) }

	// Check table dimensions first.
	const columnCountMismatch = compareColumnCount(context)
	if (columnCountMismatch) return columnCountMismatch
	const rowCountMismatch = compareRowCount(context)
	if (rowCountMismatch) return rowCountMismatch

	// Check the columns, while gathering a set of viable column mappings.
	const { mismatch: columnMismatch, columnMappings } = compareColumns(context)
	if (columnMismatch) return columnMismatch

	// Check if a mapping exists for which the row values match.
	const rowMismatch = compareRows(context, columnMappings)
	if (rowMismatch) return rowMismatch

	// All requirements are met.
	return { correct: true, report: { reason: 'correct' } }
}
