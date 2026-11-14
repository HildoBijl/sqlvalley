import assert from 'node:assert/strict'
import { createServer as createHttpServer } from 'node:http'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { createServer } from 'vite'
import initSqlJs from 'sql.js'

// SSR loading needs Vite's transforms but no listening HTTP or websocket server.
const transport = createHttpServer()
const server = await createServer({ server: { middlewareMode: true, open: false, hmr: { server: transport } }, appType: 'custom' })
const SQL = await initSqlJs({ locateFile: file => fileURLToPath(new URL(`../node_modules/sql.js/dist/${file}`, import.meta.url)) })
let variantsChecked = 0
let reducersChecked = 0
let evidenceChecks = 0
const failures = []
try {
	const { storyDatabaseSource } = await server.ssrLoadModule('/src/curriculum/database/storyDatabaseSource.ts')
	const { personnelCases, expenseCases, performanceCases, saleCases } = await server.ssrLoadModule('/src/curriculum/database/storyCases.ts')
	const { databaseSource: baselineSource } = await server.ssrLoadModule('/packages/mock-data/src/databaseSource.ts')
	const { getAvailableTableKeys } = await server.ssrLoadModule('/src/curriculum/database/tableIntroductions.ts')
	const { storyModules } = await server.ssrLoadModule('/src/curriculum/exercises/storyModules.ts')
	const { getStorySolvedCount, selectNextStoryExercise } = await server.ssrLoadModule('/src/curriculum/exercises/storyProgress.ts')
	const { buildModuleExercises } = await server.ssrLoadModule('/src/curriculum/buildModuleExercises.ts')
	const { generateExerciseInstance } = await server.ssrLoadModule('/packages/exercise-instances/src/generation.ts')
	const { gradeSqlQuery } = await server.ssrLoadModule('/packages/sql-exercises/src/exercises/SQLMonoExercise/construction/gradeSqlQuery.ts')
	const { compareQueryResults } = await server.ssrLoadModule('/packages/sql-grading/src/index.ts')

	// Author-controlled reference facts must stay in sync with the neutral dataset.
	const baseline = new SQL.Database()
	baseline.run(baselineSource.buildSql({ tables: [...baselineSource.tableKeys], size: 'full' }))
	for (const item of personnelCases) {
		const row = baseline.exec(`SELECT first_name || ' ' || last_name, current_salary, city, ${item.contactField} FROM employees WHERE e_id = ${item.id}`)[0].values[0]
		assert.deepEqual(row, [item.name, item.salary, item.city, item.contact])
		assert.equal(baseline.exec(`SELECT status FROM contracts WHERE e_id = ${item.id} AND start_date = '${item.leaveStart}'`)[0].values[0][0], item.leave)
	}
	for (const item of saleCases) assert.equal(baseline.exec(`SELECT price FROM transactions WHERE t_id = ${item.id}`)[0].values[0][0], item.price)
	for (const item of performanceCases) assert.equal(baseline.exec(`SELECT revenue FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = 'Q1' AND category = '${item.category}'`)[0].values[0][0], item.revenue)
	baseline.close()

	for (const moduleId of Object.keys(storyModules)) {
		const tables = getAvailableTableKeys(moduleId)
		assert.equal(tables.includes('recordChanges'), moduleId === 'write-multi-step-query')
		const files = (await readdir(`src/modules/${moduleId}/exercises`)).filter(file => file.endsWith('.tsx'))
		assert.equal(files.length, 3)
		const specs = await Promise.all(files.map(async file => (await server.ssrLoadModule(`/src/modules/${moduleId}/exercises/${file}`)).default))
		const registrations = buildModuleExercises(specs, moduleId)
		assert.equal(new Set(registrations.map(item => item.exerciseId)).size, 3)
		for (const size of ['small', 'full']) {
			const database = new SQL.Database()
			database.run(storyDatabaseSource.buildSql({ tables, size }))
			const availableTables = new Set(database.exec("SELECT name FROM sqlite_master WHERE type = 'table'")[0].values.map(row => row[0]))
			// Before introduction, foreign-key target tables deliberately do not exist.
			const violations = (database.exec('PRAGMA foreign_key_check')[0]?.values ?? []).filter(row => availableTables.has(row[2]))
			assert.deepEqual(violations, [], `${moduleId}/${size}: foreign keys among available tables`)
			const context = {
				moduleId, tableKeys: tables,
				getUserDatabase: () => database,
				getGradingDatabase: () => database,
				getUserDatabaseHandle: () => ({ database, loading: false, reset() {} }),
				getGradingDatabaseHandle: () => ({ database, loading: false, reset() {} }),
			}
			const solvedHistory = []
			for (const [specIndex, spec] of specs.entries()) {
				const registration = registrations[specIndex]
				for (const [variant, entry] of spec.story.variants.entries()) {
					const label = `${moduleId}/${spec.story.key}/${variant}/${size}`
					try {
						const parameters = spec.definition.generateParameters({})
						assert.deepEqual(Object.keys(parameters), ['variant'])
						assert.equal(typeof parameters.variant, 'number')
						assert.equal(spec.definition.getSolution({ parameters: { variant } }).query, entry.query)
						assert.throws(() => spec.definition.getSolution({ parameters: { variant: -1 } }))
						const output = database.exec(entry.query)[0]
						assert.ok(output?.values.length, 'authored variant must have relevant rows')
						const grade = input => gradeSqlQuery({ input, expected: entry.query, database, comparisonOptions: spec.definition.comparisonOptions })
						assert.equal(grade(entry.query).correct, true)
						assert.equal(grade('SELECT 1 AS wrong_answer').correct, false)
						assert.equal(grade(`SELECT * FROM (${entry.query}) WHERE 1 = 0`).correct, false)
						if (spec.definition.comparisonOptions?.requireEqualRowOrder && output.values.length > 1) {
							assert.equal(compareQueryResults({ ...output, values: [...output.values].reverse() }, output, spec.definition.comparisonOptions).correct, false, 'ordering must affect grading')
						}
						if (spec.story.key === 'status-counts' && entry.query.includes('COUNT(price)')) assert.equal(grade(entry.query.replace('COUNT(price)', 'COUNT(*)')).correct, false, 'unknown prices must affect counts')
						if (spec.story.key === 'amounts' && entry.query.includes('<=')) assert.equal(grade(entry.query.replace('<=', '<')).correct, false, 'include the numeric boundary')
						if (spec.story.key === 'expense-ranges') {
							assert.equal(grade(entry.query.replace(/AND amount[\s\S]*/, '')).correct, false, 'the amount window must distinguish invoice references')
							if (entry.query.includes('>=')) assert.equal(grade(entry.query.replace('>=', '>')).correct, false, 'include the lower boundary')
						}
						if (spec.story.key === 'universal-sales') {
							const productId = output.values[0][0]
							database.run('SAVEPOINT counterexample')
							database.run(`INSERT INTO transactions SELECT 99999999, t.vendor, t.buyer, t.prod_id, '2025-04-30 20:00:00', p.est_value * 2, NULL, 'COMPLETED' FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id WHERE p.p_id = ${productId} LIMIT 1`)
							assert.ok(!(database.exec(entry.query)[0]?.values ?? []).some(row => row[0] === productId), 'one counterexample must disqualify an asset')
							database.run('ROLLBACK TO counterexample; RELEASE counterexample')
						}
						if (spec.definition.comparisonOptions?.requireEqualColumnNames) {
							const wrongAlias = entry.query.replace(/\bAS ([a-z_]+)/, 'AS wrong_alias')
							if (wrongAlias !== entry.query) assert.equal(grade(wrongAlias).correct, false, 'required output aliases')
						}
						for (const part of ['Problem', 'Prompt', 'Payoff', 'Solution']) {
							const html = renderToStaticMarkup(createElement(spec.component[part], { parameters: { variant } }))
							assert.ok(html.length)
							if (part === 'Prompt' || part === 'Payoff') assert.ok(html.includes('Purpose:') && html.includes('Goal:'))
						}
						if (spec.story.key === 'allocation-handoffs') {
							assert.ok(output.values.some(row => row[0] === 72738553 && row[3] === null))
							assert.ok(output.values.some(row => row[3] !== null))
							assert.equal(grade(entry.query.replaceAll('LEFT JOIN', 'JOIN')).correct, false)
						}
						if (moduleId === 'write-multi-step-query') {
							const culprit = { 'commercial-attribution': 23062302, 'personnel-attribution': 23070303, 'expense-attribution': 23121126 }[spec.story.key]
							assert.equal(output.values.length, 1)
							assert.equal(output.values[0][0], culprit)
							// Both attribution and corroborating business links are necessary.
							const disruptions = spec.story.key === 'commercial-attribution'
								? ["DELETE FROM record_changes WHERE table_name = 'transactions' AND row_key = '25031001'", "DELETE FROM record_changes WHERE table_name = 'quarterly_performance'", 'UPDATE transactions SET price = 999999999 WHERE t_id = 25031001']
								: spec.story.key === 'personnel-attribution'
									? ["DELETE FROM record_changes WHERE field_name = 'current_salary' AND row_key = '72738553'", "DELETE FROM record_changes WHERE field_name = 'city' AND row_key = '72738553'", 'UPDATE employees SET current_salary = 165000 WHERE e_id = 72738553']
									: ["DELETE FROM record_changes WHERE table_name = 'expenses' AND row_key = '509902'", 'UPDATE expenses SET amount = 1 WHERE exp_id = 509901', "UPDATE record_changes SET actor_e_id = 23062301 WHERE table_name = 'expenses' AND row_key = '509902'"]
							for (const disruption of disruptions) {
								database.run('SAVEPOINT missing_link')
								database.run(disruption)
								assert.equal(database.exec(entry.query)[0]?.values.length ?? 0, 0, disruption)
								database.run('ROLLBACK TO missing_link; RELEASE missing_link')
								evidenceChecks++
							}
						}
						if (size === 'full') {
							const instance = { ...await generateExerciseInstance(registration.exerciseId, registration.definition, context), parameters: { variant } }
							assert.deepEqual(JSON.parse(JSON.stringify(instance.parameters)), { variant })
							const reduce = (action, state = instance.initialState) => registration.definition.processSoloAction({ parameters: instance.parameters, state, action, context, updateSkills() {} })
							const failed = await reduce({ type: 'input', input: { query: { type: 'SQL', value: 'SELECT 1 AS wrong_answer' } } })
							assert.notEqual(failed.state.solved, true)
							const solved = await reduce({ type: 'input', input: { query: { type: 'SQL', value: entry.query } } }, failed.state)
							assert.equal(solved.state.solved, true)
							assert.equal(solved.report.query.correct, true)
							const gaveUp = await reduce({ type: 'giveUp' })
							assert.equal(gaveUp.state.givenUp, true)
							assert.notEqual((await reduce({ type: 'input', input: { query: { type: 'SQL', value: entry.query } } }, gaveUp.state)).state.solved, true)
							if (variant === 0) {
								const asHistory = result => ({ ...instance, history: [{ action: result.state.solved ? { type: 'input', input: { query: { type: 'SQL', value: entry.query } } } : { type: 'giveUp' }, ...result, submittedAt: Date.now() }] })
								assert.equal(getStorySolvedCount(moduleId, [asHistory(gaveUp)]), 0)
								const saved = asHistory(solved)
								solvedHistory.push(saved)
								assert.equal(getStorySolvedCount(moduleId, [...solvedHistory, saved]), solvedHistory.length)
								assert.equal(getStorySolvedCount(moduleId, [{ ...saved, version: 2 }]), 0)
								const next = selectNextStoryExercise(registrations, solvedHistory)
								assert.ok(next)
								if (solvedHistory.length < 3) assert.ok(!solvedHistory.some(item => item.exerciseId === next.exerciseId))
							}
							reducersChecked++
						}
						variantsChecked++
					} catch (error) { failures.push(`${label}: ${error.message}`) }
				}
			}
			if (size === 'full') assert.equal(getStorySolvedCount(moduleId, solvedHistory), 3)
			if (tables.includes('expenses')) for (const item of expenseCases) assert.equal(database.exec(`SELECT COUNT(*) FROM expenses WHERE exp_id IN (${item.originalId}, ${item.duplicateId})`)[0].values[0][0], 2)
			database.close()
		}
	}
	assert.deepEqual(failures, [])
	console.log(`Verified ${variantsChecked} variant/dataset combinations, ${reducersChecked} reducer flows and ${evidenceChecks} broken-evidence checks across 39 families and 13 modules.`)
} finally { await server.close() }
