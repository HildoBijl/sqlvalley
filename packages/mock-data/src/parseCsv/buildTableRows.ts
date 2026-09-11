import { type ColumnTypes, type ColumnValue, converters } from './valueConversion'
import type { ParsedCsv } from './parseCsv'

// Build SQL rows from parsed CSV using the declared column types.
export function buildTableRows({ headers, records }: ParsedCsv, columns: ColumnTypes): ColumnValue[][] {
	const keys = Object.keys(columns)
	const missingKeys = keys.filter(key => !headers.includes(key))
	const unexpectedHeaders = headers.filter(header => !keys.includes(header))
	if (missingKeys.length) throw new TypeError(`CSV is missing columns: ${missingKeys.join(', ')}.`)
	if (unexpectedHeaders.length) throw new TypeError(`CSV contains unexpected columns: ${unexpectedHeaders.join(', ')}.`)
	const columnConverters = keys.map(key => converters[columns[key]])
	return records.map(record => keys.map((key, index) => columnConverters[index](record[key])))
}
