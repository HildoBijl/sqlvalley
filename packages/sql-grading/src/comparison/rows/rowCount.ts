import type { ComparisonMismatch } from '../../types'
import type { ComparisonContext } from '../types'

// Check the row count before comparing individual row values.
export function compareRowCount({ input, expected }: ComparisonContext): ComparisonMismatch | undefined {
	if (input.values.length === expected.values.length) return
	return {
		correct: false,
		report: { reason: 'row-count', input: input.values.length, expected: expected.values.length },
	}
}
