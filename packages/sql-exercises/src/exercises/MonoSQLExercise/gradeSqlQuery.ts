import type { Database } from '@sqlvalley/sqljs'
import { type ComparisonOptions, compareQueryResults } from '@sqlvalley/sql-grading'

import type { SqlSubmissionReport } from '../../sqlInput'

interface GradeSqlQueryOptions {
	query: string
	solution: string
	database: Database
	comparisonOptions?: ComparisonOptions
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
		const comparison = compareQueryResults(output[0], expected, comparisonOptions)
		return comparison.correct
			? { correct: true, result: comparison.report }
			: { correct: false, result: comparison.report }
	} catch {
		return { correct: false, result: { reason: 'grading-error' } }
	}
}
