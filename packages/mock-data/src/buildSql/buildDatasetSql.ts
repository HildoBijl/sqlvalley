import { type ColumnValue, buildTableRows, parseCsv } from '../parseCsv'
import { type DatasetSize, type TableDefinition, type TableKey, tableRegistry } from '../tables'

const tableSqlCache = new WeakMap<TableDefinition, Map<DatasetSize, string>>()

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
		statements.push(getTableSql(definition, size))
	})
	return statements.join('\n\n').trim()
}

function getTableSql(definition: TableDefinition, size: DatasetSize): string {
	let sqlBySize = tableSqlCache.get(definition)
	if (!sqlBySize) {
		sqlBySize = new Map()
		tableSqlCache.set(definition, sqlBySize)
	}
	const cachedSql = sqlBySize.get(size)
	if (cachedSql !== undefined) return cachedSql
	const rows = buildTableRows(parseCsv(definition.csvBySize[size]), definition.columns)
	const insertSql = buildInsertSql(definition.name, Object.keys(definition.columns), rows)
	const sql = [definition.createTableSql, insertSql].filter(Boolean).join('\n\n').trim()
	sqlBySize.set(size, sql)
	return sql
}

function buildInsertSql(table: string, columns: string[], rows: ColumnValue[][]): string {
	if (rows.length === 0) return ''
	if (columns.length === 0) throw new TypeError('Cannot insert rows without columns.')
	rows.forEach((row, index) => {
		if (row.length !== columns.length) throw new TypeError(`Row ${index + 1} has ${row.length} values; expected ${columns.length}.`)
	})
	const columnList = columns.map(formatSqlIdentifier).join(', ')
	const values = rows.map(row => `(${row.map(formatSqlValue).join(', ')})`).join(',\n    ')
	return `INSERT INTO ${formatSqlIdentifier(table)} (${columnList}) VALUES\n    ${values};`
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
