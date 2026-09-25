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
	const columnCountError = compareColumnCount(context)
	if (columnCountError) return columnCountError
	const rowCountError = compareRowCount(context)
	if (rowCountError) return rowCountError

	// Check the columns, while gathering a set of viable column mappings.
	const { error: columnError, columnMappings } = compareColumns(context)
	if (columnError) return columnError

	// Check if a mapping exists for which the row values match.
	const rowError = compareRows(context, columnMappings)
	if (rowError) return rowError

	// All requirements are met.
	return { correct: true, report: { reason: 'correct' } }
}
