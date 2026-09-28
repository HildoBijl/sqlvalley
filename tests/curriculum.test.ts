import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import ts from 'typescript'

import { createDatabase } from './helpers'

function sourceQueries(file) {
	const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
	const queries = []
	function visit(node) {
		if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && /^\s*(SELECT|WITH)\s/i.test(node.text) && /\bFROM\b/i.test(node.text)) {
			queries.push({ query: node.text, line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1 })
		}
		ts.forEachChild(node, visit)
	}
	visit(source)
	return queries
}

function moduleFiles(directory = 'src/modules') {
	return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		const filename = path.join(directory, entry.name)
		return entry.isDirectory() ? moduleFiles(filename) : filename.endsWith('.tsx') ? [filename] : []
	})
}

for (const size of ['small', 'full'] as const) {
	test(`static lesson and exercise queries execute on ${size} data`, () => {
		const database = createDatabase(size)
		try {
			for (const file of moduleFiles()) {
				for (const { query, line } of sourceQueries(file)) {
					// These two displayed examples document a different schema or SQL dialect.
					if (file === 'src/modules/join-tables/Theory.tsx' && query.includes('USING (e_id)')) continue
					if (file === 'src/modules/write-look-up-query/Theory.tsx' && query.includes('> ALL')) continue
					assert.doesNotThrow(() => database.exec(query), `${file}:${line}`)
				}
			}
		} finally { database.close() }
	})
}

test('salary-to-budget figure uses the displayed greater-than condition', () => {
	const database = createDatabase('small')
	try {
		const { query } = sourceQueries('src/modules/ra-join-relations/Theory.tsx').find(({ query }) => query.includes('0.2*budget'))
		const rows = database.exec(query)[0].values
		assert.equal(rows.length, 1)
		assert.equal(rows[0][1], 'Human Resources')
	} finally { database.close() }
})

test('the safe Datalog figure excludes managers allocated to their department', () => {
	const database = createDatabase('small')
	try {
		const { query } = sourceQueries('src/modules/dl-check-rule-safety/Theory.tsx').find(({ query }) => query.includes('WHERE e.current_salary'))
		const actual = database.exec(query)[0]?.values ?? []
		const expected = database.exec(`SELECT d.d_name, d.budget, e.first_name, e.last_name, e.current_salary
			FROM departments d JOIN employees e ON e.e_id = d.manager_id
			WHERE e.current_salary > d.budget / 20
			AND NOT EXISTS (SELECT 1 FROM allocations a WHERE a.e_id = e.e_id AND a.d_id = d.d_id)`)[0]?.values ?? []
		assert.deepEqual(actual, expected)
	} finally { database.close() }
})

test('percentages keep their fractional part', () => {
	const database = createDatabase()
	try {
		const { query } = sourceQueries('src/modules/use-filtered-aggregation/Theory.tsx').find(({ query }) => query.includes('AS percentage'))
		const row = database.exec(query)[0].values.find(row => row[0] === 'Menlo Park')
		assert.ok(row)
		assert.ok(Math.abs(Number(row[2]) - 100 / 6) < 1e-10)
	} finally { database.close() }
})

test('calendar anniversaries exclude adjacent dates and handle February 29', () => {
	const database = createDatabase()
	try {
		const { query } = sourceQueries('src/modules/write-multi-criterion-query/Theory.tsx').find(({ query }) => query.includes("DATE(start_date, '+1 year'"))
		database.run('DELETE FROM contracts')
		for (const [start, end] of [['2021-01-01', '2022-01-01'], ['2021-01-01', '2022-01-02'], ['2020-01-01', '2020-12-31'], ['2024-02-29', '2025-02-28']])
			database.run('INSERT INTO contracts(e_id, start_date, end_date) VALUES (41376655, ?, ?)', [start, end])
		assert.equal(database.exec(query)[0].values.length, 2)
	} finally { database.close() }
})
