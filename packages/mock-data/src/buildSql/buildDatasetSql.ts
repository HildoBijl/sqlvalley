import type { ColumnValue } from '../parseCsv'
import type { DatasetSize } from '../tables'
import { type TableKey, tableRegistry } from '../tables'

// Build SQL statements to create and populate a dataset.
export function buildDatasetSql({ tables, size = 'small' }: { tables: TableKey[], size?: DatasetSize }): string {
	if (!Array.isArray(tables)) throw new TypeError('Expected tables to be an array.')
	if (size !== 'small' && size !== 'full') throw new TypeError(`Unknown dataset size "${size}".`)
	if (tables.length === 0) return ''
	const statements: string[] = []
	const seen = new Set<string>()
	tables.forEach(tableKey => {
		const definition = tableRegistry[tableKey]
		if (!definition) throw new TypeError(`Unknown table "${tableKey}".`)
		if (seen.has(definition.name)) return
		seen.add(definition.name)
		statements.push(definition.createTableSql)
		const rows = definition.rowsBySize[size]
		if (rows.length > 0) statements.push(buildInsertSql(definition.name, Object.keys(definition.columns), rows))
	})
	return statements.join('\n\n').trim()
}

function buildInsertSql(table: string, columns: string[], rows: ColumnValue[][]): string {
	if (rows.length === 0) return ''
	if (columns.length === 0) throw new TypeError('Cannot insert rows without columns.')
	rows.forEach((row, index) => {
		if (row.length !== columns.length) throw new TypeError(`Row ${index + 1} has ${row.length} values; expected ${columns.length}.`)
	})
	const columnList = columns.map(formatSqlIdentifier).join(', ')
	const values = rows.map(row => `(${row.map(formatSqlValue).join(', ')})`).join(',\n    ')
	return `INSERT INTO ${formatSqlIdentifier(table)} (${columnList}) VALUES\n    ${values}`
}

function formatSqlIdentifier(identifier: string): string {
	return `"${identifier.replace(/"/g, '""')}"`
}

function formatSqlValue(value: ColumnValue): string {
	if (value === null) return 'NULL'
	if (typeof value === 'number') {
		if (!Number.isFinite(value)) throw new TypeError(`Expected a finite number, received "${value}".`)
		return String(value)
	}
	if (typeof value === 'boolean') return value ? '1' : '0'
	return `'${value.replace(/'/g, "''")}'`
}
