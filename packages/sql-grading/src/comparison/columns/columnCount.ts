import type { ComparisonResult } from '../../types'
import type { ComparisonContext } from '../types'
import { getColumnNameDifferences } from './columnNames'

// Check the column count before attempting to match individual columns.
export function compareColumnCount(context: ComparisonContext): ComparisonResult | undefined {
	// If the counts match, all is in order.
	const { input, expected } = context
	if (input.columns.length === expected.columns.length) return

	// If the count is off, find the differences and report them.
	const { missing, extra } = getColumnNameDifferences(context)
	return {
		correct: false,
		report: {
			reason: 'column-count',
			input: input.columns.length,
			expected: expected.columns.length,
			missing,
			extra,
		},
	}
}
