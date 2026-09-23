import type { ComparisonReport } from './types'
import { formatQuotedList, formatSampleDifferences } from './formatting'
import { EMPTY_RESULT_MESSAGE, TOO_MANY_COLUMNS_MESSAGE, TOO_FEW_COLUMNS_MESSAGE, TOO_MANY_ROWS_MESSAGE, TOO_FEW_ROWS_MESSAGE, COLUMN_ORDER_MESSAGE, getColumnNameMismatchFeedback, INCORRECT_VALUES_IN_COLUMNS_MESSAGE, INCORRECT_VALUES_IN_COLUMN_MESSAGE, ROW_VALUE_MISMATCH_FEEDBACK } from './messages'

export function getComparisonFeedback(report: ComparisonReport): string {
	switch (report.reason) {
		case 'correct': return 'Correct!'
		case 'empty-result': return EMPTY_RESULT_MESSAGE
		case 'column-order': return COLUMN_ORDER_MESSAGE
		case 'column-count': return report.actual > report.expected ? TOO_MANY_COLUMNS_MESSAGE : TOO_FEW_COLUMNS_MESSAGE
		case 'row-count': return report.actual > report.expected ? TOO_MANY_ROWS_MESSAGE : TOO_FEW_ROWS_MESSAGE
		case 'column-names': return getColumnNameMismatchFeedback(report.missing, report.extra, formatQuotedList(report.missing)) ?? TOO_MANY_COLUMNS_MESSAGE
		case 'column-values': return report.columns.length === 1 ? INCORRECT_VALUES_IN_COLUMN_MESSAGE(report.columns[0]) : INCORRECT_VALUES_IN_COLUMNS_MESSAGE(report.columns.length ? formatQuotedList(report.columns) : undefined)
		case 'row-values': return ROW_VALUE_MISMATCH_FEEDBACK(formatSampleDifferences(report.differences, report.ordered))
	}
}
