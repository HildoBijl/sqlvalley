import { areValuesEqual } from '../values'
import type { ColumnComparisonResult, ComparisonContext } from '../types'
import { generateColumnMappings, hasColumnMapping } from './columnMappings'

// Match columns by their values. (For when their names do not have to match.)
export function compareColumnsByContent(context: ComparisonContext): ColumnComparisonResult {
	const { input, expected, options } = context

	// When the order of the columns must match, compare the columns by their order. If they match, apply the identity mapping in the future.
	if (options.requireEqualColumnOrder) {
		const mismatchedColumns = input.columns.filter((_, index) => !areColumnsEqual(context, index, index))
		return mismatchedColumns.length === 0
			? { columnMappings: [expected.columns.map((_, index) => index)] }
			: {
				mismatch: { correct: false, report: { reason: 'ordered-column-values', columns: mismatchedColumns } },
				columnMappings: [],
			}
	}

	// Check which columns match with which other columns to derive all potential column mappings.
	const candidates = expected.columns.map((_, expectedIndex) => input.columns.flatMap((__, inputIndex) => areColumnsEqual(context, inputIndex, expectedIndex) ? [inputIndex] : []))
	if (hasColumnMapping(candidates)) return { columnMappings: generateColumnMappings(candidates) }

	// Report input columns that do not match any expected column.
	const candidatesByInput = invertCandidates(candidates, input.columns.length)
	const unmatchedColumns = input.columns.filter((_, inputIndex) => candidatesByInput[inputIndex].length === 0)
	if (unmatchedColumns.length > 0) {
		return {
			mismatch: { correct: false, report: { reason: 'unmatched-column-values', columns: unmatchedColumns } },
			columnMappings: [],
		}
	}

	// Otherwise, a group of equivalent input columns is competing for too few expected columns.
	const surplusGroup = findSurplusCandidateGroup(candidates, candidatesByInput)
	return {
		mismatch: {
			correct: false,
			report: {
				reason: 'surplus-column-match',
				columns: surplusGroup.inputIndices.map(index => input.columns[index]),
				matchingExpectedColumnCount: surplusGroup.expectedIndices.length,
			},
		},
		columnMappings: [],
	}
}

// Turn a list of candidates, as seen by the "expected" table, into a list of candidates as seen from "input".
function invertCandidates(candidates: readonly (readonly number[])[], inputColumnCount: number): number[][] {
	const candidatesByInput: number[][] = Array.from({ length: inputColumnCount }, () => [])
	candidates.forEach((inputCandidates, expectedIndex) => {
		inputCandidates.forEach(inputIndex => candidatesByInput[inputIndex].push(expectedIndex))
	})
	return candidatesByInput
}

// Find the groups of columns from the input table that do match to columns of the expected table, but in a superfluous quantity. (For instance two columns from the input table that both equal a single column from the expected table.)
function findSurplusCandidateGroup(candidates: readonly (readonly number[])[], candidatesByInput: readonly (readonly number[])[]): { inputIndices: number[]; expectedIndices: number[] } {
	const visitedInputIndices = new Set<number>()

	// Walk through the input columns to see if they suffer from the problem we are searching for.
	for (let inputIndex = 0; inputIndex < candidatesByInput.length; inputIndex++) {
		if (visitedInputIndices.has(inputIndex)) continue
		const inputIndices = new Set<number>([inputIndex])
		const expectedIndices = new Set<number>()
		const pendingInputIndices = [inputIndex]

		// Find all linked columns from both tables: for the current input column, find the expected columns it matches to, and for those expected columns, find the input columns they match to. Repeat to find two groups of matching columns.
		while (pendingInputIndices.length > 0) {
			const currentInputIndex = pendingInputIndices.pop()
			if (currentInputIndex === undefined) break
			visitedInputIndices.add(currentInputIndex)
			for (const expectedIndex of candidatesByInput[currentInputIndex]) {
				if (expectedIndices.has(expectedIndex)) continue
				expectedIndices.add(expectedIndex)
				for (const relatedInputIndex of candidates[expectedIndex]) {
					if (inputIndices.has(relatedInputIndex)) continue
					inputIndices.add(relatedInputIndex)
					pendingInputIndices.push(relatedInputIndex)
				}
			}
		}

		// If there are indeed more input columns than expected columns in this group, then we have found a candidate for superfluous columns. Return it.
		if (inputIndices.size > expectedIndices.size) return { inputIndices: [...inputIndices], expectedIndices: [...expectedIndices] }
	}

	// Should never happen.
	throw new Error('Column candidates have no complete mapping, but no surplus input group was found.')
}

// Helper that compares if two columns have equal values.
function areColumnsEqual(context: ComparisonContext, inputIndex: number, expectedIndex: number): boolean {
	// Extract the respective columns.
	const { input, expected, options } = context
	const inputValues = input.values.map(row => row[inputIndex])
	const expectedValues = expected.values.map(row => row[expectedIndex])

	// When order matters, check if each element matches.
	if (options.requireEqualRowOrder) {
		return expectedValues.every((value, index) => areValuesEqual(inputValues[index], value, options.caseSensitiveValues))
	}

	// When order does not matter, try to find a mapping between rows.
	const usedInputValues = new Set<number>()
	return expectedValues.every(value => {
		const index = inputValues.findIndex((candidate, index) => !usedInputValues.has(index) && areValuesEqual(candidate, value, options.caseSensitiveValues))
		if (index === -1) return false
		usedInputValues.add(index)
		return true
	})
}
