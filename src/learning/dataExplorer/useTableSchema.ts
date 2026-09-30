import { useMemo } from 'react'

import { type DatabaseHandle, useQuery } from '@sqlvalley/sql'

export interface TableInfo {
	name: string
	columns: { name: string; type: string; isPrimaryKey: boolean; isForeignKey: boolean }[]
	relationships: { fromColumn: string; toTable: string; toColumn: string }[]
}

// SQLite exposes both inline and table-level constraints, including composite keys.
export function useTableSchema(database: DatabaseHandle) {
	const query = useQuery(database, `SELECT m.name AS tableName, c.name AS columnName, c.type, c.pk,
		f.id AS foreignKeyId, f.seq, f."table" AS targetTable, f."to" AS targetColumn
		FROM sqlite_schema m
		JOIN pragma_table_info(m.name) c
		LEFT JOIN pragma_foreign_key_list(m.name) f ON f."from" = c.name
		WHERE m.type = 'table' AND m.name NOT LIKE 'sqlite_%'
		ORDER BY m.name, c.cid, f.id, f.seq`)
	const tables = useMemo(() => {
		const result = new Map<string, TableInfo>()
		for (const [tableName, columnName, type, pk, foreignKeyId, , targetTable, targetColumn] of query.results?.[0]?.values ?? []) {
			const name = String(tableName)
			let table = result.get(name)
			if (!table) {
				table = { name, columns: [], relationships: [] }
				result.set(name, table)
			}
			if (!table.columns.some(column => column.name === columnName)) table.columns.push({ name: String(columnName), type: String(type), isPrimaryKey: Number(pk) > 0, isForeignKey: foreignKeyId !== null })
			if (foreignKeyId !== null) table.relationships.push({ fromColumn: String(columnName), toTable: String(targetTable), toColumn: targetColumn === null ? '(primary key)' : String(targetColumn) })
		}
		return [...result.values()]
	}, [query.results])
	return { tables, loading: query.loading, error: query.error }
}
