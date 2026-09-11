export function asRecord(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
	return value as Record<string, unknown>
}

export function isIncluded<T>(options: readonly T[], value: unknown): value is T {
	return options.some(option => option === value)
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function parseRecord<T>(raw: unknown, isValue: (value: unknown) => value is T): Record<string, T> | undefined {
	if (!isRecord(raw)) return undefined
	const result: Record<string, T> = {}
	for (const [key, value] of Object.entries(raw)) {
		if (key.trim() && isValue(value)) result[key] = value
	}
	return result
}
