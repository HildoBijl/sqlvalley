import assert from 'node:assert/strict'
import test from 'node:test'

import { executeQuery } from '../packages/sql/src/databaseProvider/executeQuery'
import { gradeSqlQuery } from '../packages/sql-exercises/src/exercises/SQLMonoExercise/construction/gradeSqlQuery'
import { createDatabase } from './helpers'

const grade = (database, input, expected, comparisonOptions = {}) => gradeSqlQuery({ database, input, expected, comparisonOptions })

test('empty SELECTs keep their schema and cannot match a missing result', () => {
	const database = createDatabase()
	try {
		const expected = 'SELECT e_id FROM employees WHERE 0'
		assert.deepEqual(executeQuery(database, expected), [{ columns: ['e_id'], values: [] }])
		assert.equal(grade(database, expected, expected).correct, true)
		assert.equal(grade(database, 'SELECT 1, 2, 3 WHERE 0', expected).correct, false)
		assert.equal(grade(database, '', expected).correct, false)
		assert.equal(grade(database, '-- no query', expected).correct, false)
		assert.equal(grade(database, '', '').correct, false)
		assert.equal(grade(database, 'SELECT 1 WHERE 0; SELECT 2', 'SELECT 2').correct, false)
	} finally { database.close() }
})

test('execution keeps result order and frees statements after errors', () => {
	const database = createDatabase()
	try {
		assert.deepEqual(executeQuery(database, 'SELECT 1 WHERE 0; SELECT 2'), [
			{ columns: ['1'], values: [] }, { columns: ['2'], values: [[2]] },
		])
		assert.throws(() => executeQuery(database, 'SELECT 1; SELECT invalid_column FROM employees'))
		database.create_function('fail', () => { throw new Error('step failed') })
		assert.throws(() => executeQuery(database, 'SELECT fail(); CREATE TABLE should_not_exist(x)'))
		assert.deepEqual(database.exec("SELECT name FROM sqlite_master WHERE name = 'should_not_exist'"), [])
		assert.deepEqual(executeQuery(database, 'CREATE TABLE checked(x); SELECT 3')[0].values, [[3]])
		database.run('DROP TABLE checked')
	} finally { database.close() }
})

test('string values are case-sensitive unless an exercise opts out', () => {
	const database = createDatabase()
	try {
		assert.equal(grade(database, 'SELECT UPPER(city) FROM employees', 'SELECT city FROM employees').correct, false)
		assert.equal(grade(database, 'SELECT UPPER(city) FROM employees', 'SELECT city FROM employees', { caseSensitiveValues: false }).correct, true)
	} finally { database.close() }
})
