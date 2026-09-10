import { type TableKey, tableRegistry } from '../tables'

// Build a completion schema (table to columns mapping) for SQL autocompletion.
export function buildCompletionSchema(tables: TableKey[]): Record<string, string[]> {
	const schema: Record<string, string[]> = {}
	const seen = new Set<string>()
	tables.forEach(tableKey => {
		const definition = tableRegistry[tableKey]
		if (!definition || seen.has(definition.name)) return
		const columns = Object.keys(definition.columns)
		if (columns.length === 0) return
		schema[definition.name] = columns
		seen.add(definition.name)
	})
	return schema
}
