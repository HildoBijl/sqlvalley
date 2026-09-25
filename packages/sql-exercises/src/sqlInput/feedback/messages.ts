import type { ComparisonReport } from '@sqlvalley/sql-grading'
import type { FieldFeedbackOptions, InputFeedback } from '@sqlvalley/input-exercise-components'

import { type SqlSubmissionReport, ensureSqlSubmissionReport } from './checks'
import { formatQuotedList, formatSampleDifferences } from './formatting'

// Turn an SQL grading report into a feedback object.
export function getSqlFeedback({ report }: FieldFeedbackOptions): InputFeedback | undefined {
	if (report === undefined) return
	return getReportFeedback(ensureSqlSubmissionReport(report))
}

function getReportFeedback(report: SqlSubmissionReport): InputFeedback {
	const result = report.result
	switch (result.reason) {
		// On an invalid query that somehow still got submitted.
		case 'execution-error': return { type: 'warning', message: 'Your query could not run on the grading dataset. Please check your query.' }
		case 'grading-error': return { type: 'error', message: 'Unable to check your answer. Please try again.' }

		// Correct.
		case 'correct': return { type: 'success', message: 'Correct!' }

		// Empty input/expected values.
		case 'empty-result': return { type: 'error', message: 'Your output seems to be empty. Some records were expected here, so something has gone wrong.' }
		case 'empty-expected-result': return { type: 'error', message: 'The expected query did not return a result. Please report this exercise so it can be fixed.' }

		// Columns.
		case 'column-count': return { type: 'error', message: getColumnCountMessage(result) }
		case 'column-order': return { type: 'error', message: "It seems like you didn't give the columns in the required order. Please check the column order." }
		case 'column-names': return { type: 'error', message: getColumnNameMessage(result.missing, result.extra) }
		case 'ordered-column-values': return { type: 'error', message: result.columns.length === 1
			? `The values in column "${result.columns[0]}" do not match the expected column in that position.`
			: `The values in ${formatQuotedList(result.columns)} do not match the expected columns in those positions.` }
		case 'unmatched-column-values': return { type: 'error', message: result.columns.length === 1
			? `The values in column "${result.columns[0]}" do not match any expected column.`
			: `The values in ${formatQuotedList(result.columns)} do not match any expected columns.` }
		case 'surplus-column-match': return { type: 'error', message: result.matchingExpectedColumnCount === 1
			? `The columns ${formatQuotedList(result.columns)} all match the same expected column, so one of them cannot be mapped correctly.`
			: `The columns ${formatQuotedList(result.columns)} match only ${result.matchingExpectedColumnCount} expected columns, so at least one cannot be mapped correctly.` }

		// Rows.
		case 'row-count': return { type: 'error', message: result.input > result.expected
			? 'You seem to have more rows than expected. Did you set up your filters well enough?'
			: 'You seem to have fewer rows than expected. Check that you included all required entries.' }
		case 'row-values': return { type: 'error', message: `${result.differenceCount === 1 ? 'One row does' : `${result.differenceCount} rows do`} not match the expected values.${formatSampleDifferences(result.differences, result.ordered)}` }
	}
}

function getColumnNameMessage(missing: string[], extra: string[]): string {
	if (missing.length === 1 && extra.length === 1) return `Your output seems to be missing a column. I expected there to be one named "${missing[0]}". I did see "${extra[0]}" though, so check spelling.`
	if (missing.length === 1) return `Your output seems to be missing a column. I expected there to be one named "${missing[0]}".`
	if (missing.length > 1) return `Your output seems to be missing some columns. Check that you have ${formatQuotedList(missing)} in your result.`
	return 'Your output seems to have more columns than was expected. Did you accidentally select too many columns?'
}

function getColumnCountMessage(report: Extract<ComparisonReport, { reason: 'column-count' }>): string {
	if (report.missing === undefined && report.extra === undefined) return `Your query returns ${report.input} ${report.input === 1 ? 'column' : 'columns'}, but ${report.expected} ${report.expected === 1 ? 'is' : 'are'} expected.`
	if (report.input > report.expected) {
		const detail = report.extra && report.extra.length > 0 ? ` The superfluous columns appear to be ${formatQuotedList(report.extra)}.` : ''
		return `Your output seems to have more columns than was expected.${detail}`
	}
	const detail = report.missing && report.missing.length > 0 ? ` The missing columns appear to be ${formatQuotedList(report.missing)}.` : ''
	return `Your output seems to have fewer columns than was expected.${detail}`
}
