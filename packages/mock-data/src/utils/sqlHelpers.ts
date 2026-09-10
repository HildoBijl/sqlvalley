import type { SqlCell } from '../types'

// Build an INSERT statement for multiple rows.
export function buildInsertStatement(table: string, columns: string[], rows: SqlCell[][]): string {
	if (rows.length === 0) return ''
	if (columns.length === 0) throw new TypeError('Cannot insert rows without columns.')
	rows.forEach((row, index) => {
		if (row.length !== columns.length) throw new TypeError(`Row ${index + 1} has ${row.length} values; expected ${columns.length}.`)
	})
	const columnList = columns.map(formatSqlIdentifier).join(', ')
	const values = rows.map(row => `(${row.map(formatSqlValue).join(', ')})`).join(',\n    ')
	return `INSERT INTO ${formatSqlIdentifier(table)} (${columnList}) VALUES\n    ${values}`
}

// Quote an identifier for use in a SQL statement.
function formatSqlIdentifier(identifier: string): string {
	return `"${identifier.replace(/"/g, '""')}"`
}

// Format a value for use in a SQL statement.
function formatSqlValue(value: SqlCell): string {
	if (value === null) return 'NULL'
	if (typeof value === 'number') {
		if (!Number.isFinite(value)) throw new TypeError(`Expected a finite number, received "${value}".`)
		return String(value)
	}
	if (typeof value === 'boolean') return value ? '1' : '0'
	return `'${String(value).replace(/'/g, "''")}'`
}
