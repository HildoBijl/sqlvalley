import type { ColumnComparisonResult, ComparisonContext } from '../types'
import { generateColumnMappings } from './columnMappings'
import { getColumnNameDifferences, normalizeColumnName } from './columnNames'

// Match columns by name, including repeated column names. 
export function compareColumnsByName(context: ComparisonContext): ColumnComparisonResult {
	// Normalize column names for proper comparison.
	const { input, expected, options } = context
	const inputNames = input.columns.map(column => normalizeColumnName(column, options.caseSensitiveColumnNames))
	const expectedNames = expected.columns.map(column => normalizeColumnName(column, options.caseSensitiveColumnNames))

	// If there is a mismatch in the naming, report on that.
	const { missing, extra } = getColumnNameDifferences(context)
	if (missing.length > 0 || extra.length > 0) {
		return {
			mismatch: { correct: false, report: { reason: 'column-names', missing, extra } },
			columnMappings: [],
		}
	}

	// If required by the options, check the column order. If it's correct, return the respective identity order as mapping.
	if (options.requireEqualColumnOrder) {
		const ordered = expectedNames.every((name, index) => name === inputNames[index])
		return ordered
			? { columnMappings: [expectedNames.map((_, index) => index)] }
			: { mismatch: { correct: false, report: { reason: 'column-order' } }, columnMappings: [] }
	}

	// Set up a candidates list for the mapping: for each column a list of other columns it can be matched with. Turn it into an iterable of potential mappings.
	const candidates = expectedNames.map(name => inputNames.flatMap((candidate, index) => candidate === name ? [index] : []))
	return { columnMappings: generateColumnMappings(candidates) }
}
