// Lazily find one-to-one mappings, as specified by the candidates list.
export function generateColumnMappings(candidates: readonly (readonly number[])[]): Iterable<readonly number[]> {
	return buildMappings(candidates, 0, [], new Set())
}

export function hasColumnMapping(candidates: readonly (readonly number[])[]): boolean {
	return !buildMappings(candidates, 0, [], new Set()).next().done
}

// Use a generator function to generate all valid mappings.
function* buildMappings(
	candidates: readonly (readonly number[])[],
	expectedIndex: number,
	mapping: number[],
	usedInputColumns: Set<number>,
): Generator<readonly number[]> {
	// Final case: if we have hit the end of the list, return the full generated mapping.
	if (expectedIndex === candidates.length) {
		yield [...mapping]
		return
	}

	// Iteration: walk through the entries to build a mapping.
	for (const inputIndex of candidates[expectedIndex]) {
		// Try to add a new entry to the mapping so far.
		if (usedInputColumns.has(inputIndex)) continue
		mapping.push(inputIndex)
		usedInputColumns.add(inputIndex)

		// Recursively find all subsequent mappings that can be generated.
		yield* buildMappings(candidates, expectedIndex + 1, mapping, usedInputColumns)

		// Undo the respective entry again.
		usedInputColumns.delete(inputIndex)
		mapping.pop()
	}
}
