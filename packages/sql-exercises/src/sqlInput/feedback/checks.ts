import { isPlainDataObject } from '@step-wise/js-utils'
import { type ComparisonMismatchReport, isComparisonReport } from '@sqlvalley/sql-grading'

export type SqlSubmissionReport =
	| { correct: true; result: { reason: 'correct' } }
	| { correct: false; result: ComparisonMismatchReport | { reason: 'execution-error' | 'grading-error' } }

export function ensureSqlSubmissionReport(report: unknown): SqlSubmissionReport {
	if (!isPlainDataObject(report) || typeof report.correct !== 'boolean' || !isSqlResult(report.result)) throw new Error('Invalid SQL submission report.')
	if (report.correct !== (report.result.reason === 'correct')) throw new Error('Inconsistent SQL submission report.')
	return report as SqlSubmissionReport
}

function isSqlResult(value: unknown): value is SqlSubmissionReport['result'] {
	return isComparisonReport(value) || (isPlainDataObject(value) && (value.reason === 'execution-error' || value.reason === 'grading-error'))
}
