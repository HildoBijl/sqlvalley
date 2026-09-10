import type { DatasetSize } from '../types'
import { buildInsertStatement } from '../utils'
import { type TableKey, tableDefinitions } from '../tables'

// Build SQL statements to create and populate tables.
export function buildSchema({ tables, size = 'small' }: { tables: TableKey[], size?: DatasetSize }): string {
	if (!Array.isArray(tables)) throw new TypeError('Expected tables to be an array.')
	if (size !== 'small' && size !== 'full') throw new TypeError(`Unknown dataset size "${size}".`)
	if (tables.length === 0) return ''
	const statements: string[] = []
	const seen = new Set<string>()
	tables.forEach(tableKey => {
		const definition = tableDefinitions[tableKey]
		if (!definition) throw new TypeError(`Unknown table "${tableKey}".`)
		if (seen.has(definition.name)) return
		seen.add(definition.name)
		statements.push(definition.createStatement)
		const rows = definition.rows[size]
		if (rows.length > 0) statements.push(buildInsertStatement(definition.name, Object.keys(definition.attributes), rows))
	})
	return statements.join('\n\n').trim()
}
