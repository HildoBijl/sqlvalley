import { Fragment } from 'react'

import { useQueryResult } from '@sqlvalley/sql'

import { RelationName, PrimaryKey, ForeignKey } from './notation'
import { useTheoryPageDatabase } from './useTheoryPageDatabase'

export function TableSchema({ table, primaryKeys = [], foreignKeys = [] }: { table: string, primaryKeys?: readonly string[], foreignKeys?: readonly string[] }) {
	const database = useTheoryPageDatabase()
	const schema = useQueryResult(database, `SELECT name FROM pragma_table_info('${table.replace(/'/g, "''")}') ORDER BY cid`)
	if (!schema) return null
	const columnNames = schema.values.map(([name]) => String(name))
	for (const key of primaryKeys) {
		if (!columnNames.includes(key)) throw new Error(`Primary key column '${key}' does not exist in table '${table}'.`)
	}
	for (const key of foreignKeys) {
		if (!columnNames.includes(key)) throw new Error(`Foreign key column '${key}' does not exist in table '${table}'.`)
	}
	return <><RelationName>{table}</RelationName> ({columnNames.map((name, index) => {
		const column = foreignKeys.includes(name) ? <ForeignKey>{name}</ForeignKey> : name
		return <Fragment key={name}>
			{index > 0 ? ', ' : ''}{primaryKeys.includes(name) ? <PrimaryKey>{column}</PrimaryKey> : column}
		</Fragment>
	})})</>
}
