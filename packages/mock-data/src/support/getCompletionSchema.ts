import { type TableKey, tableDefinitions } from '../tables'

// Get a completion schema (table to columns mapping) for SQL autocompletion.
export function getCompletionSchema(tables: TableKey[]): Record<string, string[]> {
	const schema: Record<string, string[]> = {}
	const seen = new Set<string>()
	tables.forEach(tableKey => {
		const definition = tableDefinitions[tableKey]
		if (!definition || seen.has(definition.name)) return
		const columns = Object.keys(definition.attributes)
		if (columns.length === 0) return
		schema[definition.name] = columns
		seen.add(definition.name)
	})
	return schema
}
