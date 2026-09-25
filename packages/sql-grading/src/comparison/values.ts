import type { ReportValue } from '../types'

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
export function serializeReportValue(value: unknown): ReportValue {
	if (value === null || typeof value === 'string' || typeof value === 'boolean') return value
	if (typeof value === 'number') {
		if (Number.isFinite(value)) return value
		return { type: 'number', value: Number.isNaN(value) ? 'NaN' : value > 0 ? 'Infinity' : '-Infinity' }
	}
	if (value === undefined) return { type: 'undefined' }
	if (value instanceof Uint8Array) return { type: 'binary', value: Array.from(value) }
	throw new Error('Unsupported SQL value in comparison report.')
}
