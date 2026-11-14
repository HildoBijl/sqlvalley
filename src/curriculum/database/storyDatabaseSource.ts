import { type TableKey, databaseSource as baselineSource } from '@sqlvalley/mock-data'
import type { DatabaseSource } from '@sqlvalley/sql/databaseProvider'

import previewRows from './storyPreviewRows.json'
import { expenseCases, personnelCases, performanceCases, saleCases, sqlLiteral } from './storyCases'

export type StoryTableKey = TableKey | 'recordChanges'
export const storyTableKeys: readonly StoryTableKey[] = [...baselineSource.tableKeys, 'recordChanges']
const evidenceColumns = ['change_id', 'table_name', 'row_key', 'field_name', 'old_value', 'new_value', 'actor_e_id', 'changed_at', 'change_kind', 'source']

function buildEvidenceSql() {
	const statements = [`CREATE TABLE record_changes (
		change_id INTEGER PRIMARY KEY, table_name TEXT NOT NULL, row_key TEXT NOT NULL,
		field_name TEXT NOT NULL, old_value TEXT, new_value TEXT, actor_e_id INTEGER NOT NULL,
		changed_at TEXT NOT NULL, change_kind TEXT NOT NULL, source TEXT NOT NULL,
		FOREIGN KEY (actor_e_id) REFERENCES employees(e_id)
	)`]
	let id = 0
	const add = (table: string, key: string | number, field: string, before: string | number | null, after: string | number | null, actor: number, kind = 'UPDATE') => {
		const values = [++id, table, String(key), field, before === null ? null : String(before), after === null ? null : String(after), actor, '2025-04-22 09:00:00', kind, 'Independent signed change-log export; authenticated individual account']
		statements.push(`INSERT INTO record_changes VALUES (${values.map(sqlLiteral).join(', ')})`)
	}
	for (const item of personnelCases) {
		add('employees', item.id, 'current_salary', item.salary, item.recordedSalary, 23070303)
		add('employees', item.id, item.contactField, item.contact, null, 23070303)
		add('employees', item.id, 'city', item.city, item.recordedCity, 23070303)
		add('contracts', `${item.id}|${item.leaveStart}`, 'status', item.leave, item.recordedLeave, 23070303)
	}
	for (const item of saleCases) add('transactions', item.id, 'price', item.price, item.recordedPrice, 23062302)
	for (const item of performanceCases) add('quarterly_performance', `2025|Q1|${item.category}`, 'revenue', item.revenue, item.recordedRevenue, 23062302)
	for (const item of expenseCases) {
		add('expenses', item.originalId, 'description', null, item.description, item.requester, 'INSERT')
		add('expenses', item.duplicateId, 'description', null, item.description, 23121126, 'INSERT')
	}
	// Legitimate, unrelated events prevent the log itself from being an answer key.
	add('employees', 14338498, 'current_salary', 235000, 245000, 23062301)
	add('employees', 23062302, 'phone', '650-593-5441', '650-593-5442', 24090361)
	add('transactions', 24121205, 'price', 370000, 374500, 14338498)
	add('expenses', 501041, 'description', 'Strategy advice', 'Marketplace strategy advisory', 23070303)
	add('employees', 72738553, 'address', 'Old contact address', '1700 N 3rd St, Unit 18', 23121126)
	return statements.join(';\n') + ';\n'
}

function buildOverlaySql(tables: readonly string[], size: string) {
	const statements: string[] = []
	const has = (table: string) => tables.includes(table)
	if (size === 'small') {
		for (const [table, copy] of Object.entries(previewRows)) {
			const key = table === 'quarterly_performance' ? 'quarterlyPerformance' : table
			if (!has(key)) continue
			for (const row of copy.rows) statements.push(`INSERT OR IGNORE INTO ${table} (${copy.columns.join(', ')}) VALUES (${row.map(sqlLiteral).join(', ')})`)
		}
	}
	if (has('employees')) for (const item of personnelCases) {
		statements.push(`UPDATE employees SET ${item.contactField} = NULL, current_salary = ${item.recordedSalary}, city = ${sqlLiteral(item.recordedCity)} WHERE e_id = ${item.id}`)
	}
	if (has('contracts')) for (const item of personnelCases) statements.push(`UPDATE contracts SET status = ${sqlLiteral(item.recordedLeave)} WHERE e_id = ${item.id} AND start_date = ${sqlLiteral(item.leaveStart)}`)
	if (has('allocations')) statements.push('DELETE FROM allocations WHERE e_id = 72738553')
	if (has('expenses')) for (const item of expenseCases) {
		statements.push(`INSERT INTO expenses VALUES (${item.originalId}, ${item.amount}, ${item.department}, ${sqlLiteral(item.description)}, ${sqlLiteral(item.firstDate)}, ${item.requester}, ${item.approver})`)
		statements.push(`INSERT INTO expenses VALUES (${item.duplicateId}, ${item.amount}, ${item.department}, ${sqlLiteral(item.description)}, ${sqlLiteral(item.secondDate)}, ${item.requester}, ${item.duplicateId === 509904 ? 'NULL' : '23121126'})`)
	}
	if (has('transactions')) for (const item of saleCases) statements.push(`UPDATE transactions SET price = ${item.recordedPrice} WHERE t_id = ${item.id}`)
	if (has('transactions')) statements.push("INSERT INTO transactions VALUES (25043099, 'sabrina.shah', 'harper7', 100264, '2025-04-30 19:00:00', NULL, NULL, 'PENDING')")
	if (has('quarterlyPerformance')) for (const item of performanceCases) statements.push(`UPDATE quarterly_performance SET revenue = ${item.recordedRevenue} WHERE fiscal_year = 2025 AND quarter = 'Q1' AND category = ${sqlLiteral(item.category)}`)
	return statements.join(';\n') + ';\n'
}

export const storyDatabaseSource = {
	tableKeys: storyTableKeys,
	datasetSizes: baselineSource.datasetSizes,
	buildCompletionSchema: (tables: readonly string[]) => ({
		...baselineSource.buildCompletionSchema(tables.filter(table => table !== 'recordChanges')),
		...(tables.includes('recordChanges') ? { record_changes: evidenceColumns } : {}),
	}),
	buildSql: ({ tables, size }: { tables: string[]; size?: string }) => {
		if (size !== 'small' && size !== 'full') throw new Error('Unknown story dataset size.')
		return baselineSource.buildSql({ tables: tables.filter(table => table !== 'recordChanges'), size })
			+ '\n' + buildOverlaySql(tables, size)
			+ (tables.includes('recordChanges') ? buildEvidenceSql() : '')
	},
} satisfies DatabaseSource
