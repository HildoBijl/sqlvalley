import type { Database } from '@sqlvalley/sqljs'
import { type CompareOptions, type SqlExecutionResult, type SqlQueryResult, validateSqlExecution, verifySqlExecution } from '@sqlvalley/sql-grading'

import type { MonoSQLCheckResult } from './types'

interface GradeSqlQueryOptions {
	query: string
	solution: string
	database: Database
	comparisonOptions?: CompareOptions
}

// Grade against the full dataset independently of the learner's preview size.
export function gradeSqlQuery({ query, solution, database, comparisonOptions }: GradeSqlQueryOptions): MonoSQLCheckResult {
	let execution: SqlExecutionResult<SqlQueryResult[]>
	try {
		execution = { success: true, output: database.exec(query) }
	} catch (error) {
		execution = { success: false, error: error instanceof Error ? error : new Error(String(error)) }
	}
	const validation = validateSqlExecution(execution)
	if (!validation.ok) return { correct: false, feedback: validation.message, feedbackType: 'warning' }
	const verification = verifySqlExecution({ output: execution.output, solution, database, comparisonOptions })
	return { correct: verification.correct, feedback: verification.message, feedbackType: verification.correct ? 'success' : 'error' }
}
