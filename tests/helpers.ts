import initSqlJs from 'sql.js'

import { allTableKeys, buildDatasetSql } from '../packages/mock-data/src/index'

export const SQL = await initSqlJs()

export function createDatabase(size: 'small' | 'full' = 'full') {
	const database = new SQL.Database()
	database.run(buildDatasetSql({ tables: allTableKeys, size }))
	return database
}
