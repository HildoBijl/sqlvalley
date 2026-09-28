import type { Database } from '@sqlvalley/sqljs'
import { executeQuery } from '@sqlvalley/sql'
import { type ComparisonOptions, compareQueryResults } from '@sqlvalley/sql-grading'

import type { SqlSubmissionReport } from '../../../sqlInput'

interface GradeSqlQueryOptions {
	input: string
	expected: string
	database: Database
	comparisonOptions?: ComparisonOptions
}

// Grade against the full dataset independently of the learner's preview size.
export function gradeSqlQuery({ input, expected, database, comparisonOptions }: GradeSqlQueryOptions): SqlSubmissionReport {
	// Run the solution query.
	let expectedResult
	try {
		expectedResult = executeQuery(database, expected)[0]
	} catch {
		return { correct: false, result: { reason: 'grading-error' } }
	}

	if (!expectedResult) return { correct: false, result: { reason: 'grading-error' } }

	// Run the input query.
	let inputResult
	try {
		inputResult = executeQuery(database, input)[0]
	} catch {
		return { correct: false, result: { reason: 'execution-error' } }
	}

	// Compare the two outcomes.
	try {
		const comparison = compareQueryResults(inputResult, expectedResult, comparisonOptions)
		return comparison.correct ? { correct: true, result: comparison.report } : { correct: false, result: comparison.report }
	} catch {
		return { correct: false, result: { reason: 'grading-error' } }
	}
}
