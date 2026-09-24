// Compare query values without discarding their types.
export function areValuesEqual(input: unknown, expected: unknown, caseSensitiveValues: boolean): boolean {
	if (typeof input === 'string' && typeof expected === 'string') {
		return caseSensitiveValues ? input === expected : input.toLowerCase() === expected.toLowerCase()
	}
	if (input instanceof Uint8Array && expected instanceof Uint8Array) return areBinaryValuesEqual(input, expected)
	return input === expected
}

function areBinaryValuesEqual(input: Uint8Array, expected: Uint8Array): boolean {
	if (input.length !== expected.length) return false
	return input.every((value, index) => value === expected[index])
}

// Turn a query value into language-neutral, serializable report data.
export function serializeReportValue(value: unknown): string {
	if (value === null) return 'NULL'
	if (value instanceof Uint8Array) return `[${Array.from(value).join(', ')}]`
	return String(value)
}
