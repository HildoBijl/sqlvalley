import type { Database } from '@sqlvalley/sqljs'
import { type CompareOptions, compareQueryResults, DEFAULT_SQL_COMPARISON_OPTIONS } from '@sqlvalley/sql-grading'

import type { SqlSubmissionReport } from '../../sqlInput'

interface GradeSqlQueryOptions {
	query: string
	solution: string
	database: Database
	comparisonOptions?: CompareOptions
}

// Grade against the full dataset independently of the learner's preview size.
export function gradeSqlQuery({ query, solution, database, comparisonOptions }: GradeSqlQueryOptions): SqlSubmissionReport {
	let output
	try {
		output = database.exec(query)
	} catch {
		return { correct: false, result: { reason: 'execution-error' } }
	}
	if (!output[0]) return { correct: false, result: { reason: 'empty-result' } }
	try {
		const expected = database.exec(solution)[0]
		const comparison = compareQueryResults(output[0], expected, { ...DEFAULT_SQL_COMPARISON_OPTIONS, ...comparisonOptions })
		return { correct: comparison.match, result: comparison.report }
	} catch {
		return { correct: false, result: { reason: 'grading-error' } }
	}
}
