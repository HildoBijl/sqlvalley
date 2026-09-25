import type { ComparisonMismatch, ReportValue } from '../../types'

import type { ComparisonContext } from '../types'
import { areValuesEqual, serializeReportValue } from '../values'

const maxDifferenceSamples = 3

interface RowDifference {
	index: number
	row: ReportValue[]
}

interface RowDifferences {
	count: number
	samples: RowDifference[]
}

// Accept a matching column mapping, or report samples from the closest mapping.
export function compareRows(context: ComparisonContext, columnMappings: Iterable<readonly number[]>): ComparisonMismatch | undefined {
	// Check for each mapping how many differences there are. On zero, note that everything is in order. Otherwise track the smallest difference set to report on it.
	let fewestDifferences: RowDifferences | undefined
	for (const mapping of columnMappings) {
		const differences = getRowDifferences(context, mapping)
		if (differences.count === 0) return
		if (!fewestDifferences || differences.count < fewestDifferences.count) fewestDifferences = differences
	}
	if (!fewestDifferences) throw new Error('Cannot compare rows without a column mapping.')

	// Set up the respective report.
	return {
		correct: false,
		report: {
			reason: 'row-values',
			differenceCount: fewestDifferences.count,
			differences: fewestDifferences.samples,
			ordered: context.options.requireEqualRowOrder,
		},
	}
}

// Helper function that finds out how many rows are different between the input and the expected tables. It also returns a sample of input rows that could not be matched.
function getRowDifferences(context: ComparisonContext, mapping: readonly number[]): RowDifferences {
	const { input, expected, options } = context

	// If order matters, walk through each row and compare it with the respective expected row.
	if (options.requireEqualRowOrder) {
		const samples: RowDifference[] = []
		let count = 0
		input.values.forEach((row, index) => {
			if (areRowsEqual(row, expected.values[index], mapping, options.caseSensitiveValues)) return
			count++
			if (samples.length < maxDifferenceSamples) samples.push({ index, row: row.map(serializeReportValue) })
		})
		return { count, samples }
	}

	// When order does not matter, try to match rows. Then determine the input rows that were never matched.
	const usedInputRows = new Set<number>()
	for (const expectedRow of expected.values) {
		const inputIndex = input.values.findIndex((row, index) =>
			!usedInputRows.has(index) && areRowsEqual(row, expectedRow, mapping, options.caseSensitiveValues),
		)
		if (inputIndex !== -1) usedInputRows.add(inputIndex)
	}
	const unmatchedInputIndices = input.values.flatMap((_, index) => usedInputRows.has(index) ? [] : [index])
	const samples = unmatchedInputIndices.slice(0, maxDifferenceSamples).map(index => ({ index, row: input.values[index].map(serializeReportValue) }))
	return { count: unmatchedInputIndices.length, samples }
}

// Helper function to check if two rows are equal, given a column mapping.
function areRowsEqual(
	input: readonly unknown[],
	expected: readonly unknown[],
	mapping: readonly number[],
	caseSensitiveValues: boolean,
): boolean {
	return mapping.every((inputIndex, expectedIndex) => areValuesEqual(input[inputIndex], expected[expectedIndex], caseSensitiveValues),)
}
