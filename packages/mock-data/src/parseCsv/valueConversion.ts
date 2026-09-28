export type ColumnValue = string | number | null | boolean

function booleanOrNull(value: string | undefined): boolean | null {
	const normalized = (value ?? '').trim().toLowerCase()
	if (!normalized) return null
	if (normalized === 'true') return true
	if (normalized === 'false') return false
	throw new TypeError(`Expected "true" or "false", received "${value}".`)
}

function numberOrNull(value: string | undefined): number | null {
	const trimmed = (value ?? '').trim()
	if (!trimmed) return null
	const parsed = Number(trimmed)
	if (!Number.isFinite(parsed)) throw new TypeError(`Expected a valid finite number, received "${value}".`)
	return parsed
}

function stringOrNull(value: string | undefined): string | null {
	const trimmed = (value ?? '').trim()
	return trimmed.length === 0 ? null : trimmed
}

function dateOrNull(value: string | undefined): string | null {
	const date = stringOrNull(value)
	if (date === null) return null
	const parsed = new Date(`${date.length === 10 ? `${date}T00:00:00` : date.replace(' ', 'T')}Z`)
	if (!/^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().replace('T', ' ').slice(0, date.length) !== date)
		throw new TypeError(`Expected an ISO calendar date or timestamp (YYYY-MM-DD[ HH:MM:SS]), received "${value}".`)
	return date
}

export const converters = {
	boolean: booleanOrNull,
	number: numberOrNull,
	string: stringOrNull,
	date: dateOrNull,
}

export type ColumnType = keyof typeof converters
export type ColumnTypes = Record<string, ColumnType>
