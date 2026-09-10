import type { SqlCell, AttributeType, Attributes } from '../types'
import { numberOrNull, stringOrNull, booleanOrNull, type ParsedCsv } from './parseCsv'

// Build SQL rows from CSV records using attribute definitions.
export function buildRows({ headers, records }: ParsedCsv, attributes: Attributes): SqlCell[][] {
	const keys = Object.keys(attributes)
	const missingKeys = keys.filter(key => !headers.includes(key))
	const unexpectedHeaders = headers.filter(header => !keys.includes(header))
	if (missingKeys.length) throw new TypeError(`CSV is missing columns: ${missingKeys.join(', ')}.`)
	if (unexpectedHeaders.length) throw new TypeError(`CSV contains unexpected columns: ${unexpectedHeaders.join(', ')}.`)
	const converters = keys.map(key => getConverter(attributes[key]))
	return records.map(record => keys.map((key, index) => converters[index](record[key])))
}

// Get the appropriate converter function for an attribute type.
function getConverter(type: AttributeType): (value: string | undefined) => SqlCell {
	switch (type) {
		case 'number': return numberOrNull
		case 'boolean': return booleanOrNull
		case 'string':
		case 'date':
		default: return stringOrNull
	}
}
