import type { ComparisonContext } from '../types'

interface ColumnNameDifferences {
	missing: string[]
	extra: string[]
}

// Find missing and extra names while accounting for duplicate column names.
export function getColumnNameDifferences(context: ComparisonContext): ColumnNameDifferences {
	// Normalize column names for proper comparison.
	const { input, expected, options } = context
	const inputNames = input.columns.map(column => normalizeColumnName(column, options.caseSensitiveColumnNames))
	const expectedNames = expected.columns.map(column => normalizeColumnName(column, options.caseSensitiveColumnNames))

	// Walk through the columns to see which are missing. Note which ones were matched.
	const usedInputColumns = new Set<number>()
	const missing: string[] = []
	expectedNames.forEach((name, expectedIndex) => {
		const inputIndex = inputNames.findIndex((candidate, index) => candidate === name && !usedInputColumns.has(index))
		if (inputIndex === -1) missing.push(expected.columns[expectedIndex])
		else usedInputColumns.add(inputIndex)
	})

	// Note the remaining unmatched columns. Return both lists.
	const extra = input.columns.filter((_, index) => !usedInputColumns.has(index))
	return { missing, extra }
}

// Normalize column names when case sensitivity is turned off.
export function normalizeColumnName(column: string, caseSensitiveColumnNames: boolean): string {
	return caseSensitiveColumnNames ? column : column.toLowerCase()
}
