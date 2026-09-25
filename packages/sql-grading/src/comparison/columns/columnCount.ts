import type { ComparisonMismatch } from '../../types'
import type { ComparisonContext } from '../types'
import { getColumnNameDifferences } from './columnNames'

// Check the column count before attempting to match individual columns.
export function compareColumnCount(context: ComparisonContext): ComparisonMismatch | undefined {
	// If the counts match, all is in order.
	const { input, expected, options } = context
	if (input.columns.length === expected.columns.length) return

	// Only identify missing or extra names when names are part of the requirements.
	const counts = { input: input.columns.length, expected: expected.columns.length }
	return {
		correct: false,
		report: options.requireEqualColumnNames
			? { reason: 'column-count', ...counts, ...getColumnNameDifferences(context) }
			: { reason: 'column-count', ...counts },
	}
}
