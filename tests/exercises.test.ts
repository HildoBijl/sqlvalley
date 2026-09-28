import assert from 'node:assert/strict'
import test from 'node:test'

import { gradeSqlQuery } from '../packages/sql-exercises/src/exercises/SQLMonoExercise/construction/gradeSqlQuery'
import sortPerformance from '../src/modules/sort-rows/exercises/sortByPerfSalary'
import sortEndDate from '../src/modules/sort-rows/exercises/sortEndDateNullLast'
import sortBudget from '../src/modules/sort-rows/exercises/sortDeptBudgetSkip'
import sortExpenditure from '../src/modules/write-multi-criterion-query/exercises/multiCriterionDepartmentsExpenditure'
import sortStartDate from '../src/modules/write-multi-criterion-query/exercises/multiCriterionStartDateRange'
import sellers from '../src/modules/write-multi-layered-query/exercises/multilayeredMockBuyerVendor'
import counts from '../src/modules/write-multi-layered-query/exercises/multilayeredWrongEmployeeCounts'
import expenses from '../src/modules/write-multi-layered-query/exercises/multilayeredMockDeptExpense'
import validation from '../src/modules/write-multi-table-query/exercises/multitableUniversalQuery'
import buyers from '../src/modules/write-multi-table-query/exercises/multitableMockInNotin'
import { createDatabase } from './helpers'

for (const exercise of [sortPerformance, sortEndDate, sortBudget, sortExpenditure, sortStartDate]) {
	test(`${exercise.exerciseId} rejects the right rows in the wrong order`, () => {
		const database = createDatabase()
		try {
			const expected = exercise.definition.solution
			const input = `SELECT * FROM (${expected.replace(/;\s*$/, '')}) ORDER BY 1 DESC`
			const comparisonOptions = exercise.definition.comparisonOptions
			assert.equal(gradeSqlQuery({ database, expected, input: expected, comparisonOptions }).correct, true)
			assert.equal(gradeSqlQuery({ database, expected, input, comparisonOptions }).correct, false)
		} finally { database.close() }
	})
}

test('profitable sellers include users with no purchases', () => {
	const database = createDatabase()
	try {
		const rows = database.exec(sellers.definition.solution)[0].values
		for (const [username, earned] of [['CANTSPOTUS', 200001], ['mbrennen2e', 51170000], ['rshovelton9e', 2849450000]])
			assert.ok(rows.some(row => row[0] === username && row[1] === 0 && row[2] === earned))
	} finally { database.close() }
})

test('department counts include departments with zero allocations or no exclusive employees', () => {
	const database = createDatabase()
	try {
		let rows = database.exec(counts.definition.solution)[0].values
		assert.ok(rows.some(row => row[0] === 'Finance & Legal' && row[1] === 8 && row[2] === 0 && row[3] === 0))
		database.run("INSERT INTO departments VALUES (9999, 'Shared staff', 41376655, 100, 10)")
		database.run('INSERT INTO allocations VALUES (41376655, 9999)')
		rows = database.exec(counts.definition.solution)[0].values
		assert.ok(rows.some(row => row[0] === 'Shared staff' && row[2] === 1 && row[3] === 0))
	} finally { database.close() }
})

test('a department without expenses is within its budget', () => {
	const database = createDatabase()
	try {
		database.run("INSERT INTO departments VALUES (9999, 'No expenses', 41376655, 100, 0)")
		assert.ok(database.exec(expenses.definition.solution)[0].values.some(row => row[0] === 9999 && row[2] === 0))
	} finally { database.close() }
})

test('every transaction must have a known validator with a qualifying salary', () => {
	const database = createDatabase()
	try {
		database.run("INSERT INTO products(p_id, category) VALUES (99999, 'Validation test')")
		database.run('INSERT INTO employees(e_id, current_salary) VALUES (99999, NULL)')
		database.run('INSERT INTO transactions(t_id, prod_id, validated_by) VALUES (99999, 99999, NULL)')
		const included = () => database.exec(validation.definition.solution)[0].values.some(row => row[0] === 'Validation test')
		assert.equal(included(), false)
		database.run('UPDATE transactions SET validated_by = 99999 WHERE t_id = 99999')
		assert.equal(included(), false)
		database.run('UPDATE employees SET current_salary = 199999 WHERE e_id = 99999')
		assert.equal(included(), true)
		database.run('UPDATE employees SET current_salary = 200000 WHERE e_id = 99999')
		assert.equal(included(), false)
	} finally { database.close() }
})

test('an unrelated NULL vendor does not remove buyers who never sold anything', () => {
	const database = createDatabase()
	try {
		database.run("INSERT INTO accounts(username, first_name, last_name) VALUES ('buyer-only', 'Buyer', 'Only')")
		database.run("INSERT INTO products(p_id, category) VALUES (99999, 'Musical Instruments')")
		database.run("INSERT INTO transactions(t_id, prod_id, buyer, vendor) VALUES (99999, 99999, 'buyer-only', NULL)")
		assert.ok(database.exec(buyers.definition.solution)[0].values.some(row => row[0] === 'Buyer' && row[1] === 'Only'))
	} finally { database.close() }
})
