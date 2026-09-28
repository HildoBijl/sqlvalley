import assert from 'node:assert/strict'
import test from 'node:test'

import { converters } from '../packages/mock-data/src/parseCsv/valueConversion'
import { tableRegistry } from '../packages/mock-data/src/tables/registry'
import { createDatabase } from './helpers'

for (const size of ['small', 'full'] as const) {
	test(`${size} fixtures have valid references and ISO dates`, () => {
		const database = createDatabase(size)
		try {
			assert.deepEqual(database.exec('PRAGMA foreign_key_check'), [])
			for (const table of Object.values(tableRegistry)) {
				for (const [column, type] of Object.entries(table.columns)) {
					if (type !== 'date') continue
					const result = database.exec(`SELECT COUNT(*) FROM ${table.name} WHERE ${column} IS NOT NULL AND (DATE(${column}) IS NULL OR DATE(${column}) <> SUBSTR(${column}, 1, 10))`)
					assert.equal(result[0].values[0][0], 0, `${table.name}.${column}`)
				}
			}
		} finally { database.close() }
	})
}

test('date conversion rejects ambiguous formats and invalid calendar dates', () => {
	for (const date of ['9/28/2026', '28-09-26', '2025-02-29', '2024-13-01', '2024-04-31', 'not a date'])
		assert.throws(() => converters.date(date), /ISO calendar date/)
	assert.equal(converters.date('2024-02-29'), '2024-02-29')
	assert.equal(converters.date(' 2026-09-28 '), '2026-09-28')
	assert.equal(converters.date('2025-01-15 10:32:44'), '2025-01-15 10:32:44')
	assert.throws(() => converters.date('2025-01-15 25:32:44'))
	assert.equal(converters.date(''), null)
})

test('introductory dates retain their month-first meaning', () => {
	const database = createDatabase('small')
	try {
		assert.equal(database.exec('SELECT date_time FROM transactions WHERE t_id = 1')[0].values[0][0], '2024-07-11')
		assert.equal(database.exec("SELECT COUNT(*) FROM contracts WHERE start_date > '2023-12-31'")[0].values[0][0], 13)
	} finally { database.close() }
})

test('generated dates retain their day-first meaning', () => {
	const database = createDatabase()
	try {
		assert.equal(database.exec('SELECT date_time FROM transactions WHERE t_id = 7')[0].values[0][0], '2014-02-10')
		assert.equal(database.exec("SELECT created_at FROM accounts WHERE username = 'rrubinovitch5o'")[0].values[0][0], '2015-08-10')
	} finally { database.close() }
})
