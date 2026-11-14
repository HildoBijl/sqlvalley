import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'process-columns',
	key: 'report-fields',
	person: 'bob',
	purpose: 'Prepare a readable transaction report.',
	goal: 'Show recorded prices beside processed date or status fields.',
	variants: [
		{ expression: "SUBSTR(date_time, 1, 7)", label: 'transaction_month', wording: 'the year and month as YYYY-MM' },
		{ expression: 'UPPER(status)', label: 'status_label', wording: 'the status in uppercase' },
		{ expression: "STRFTIME('%Y', date_time)", label: 'transaction_year', wording: 'the transaction year as text' },
	].map(item => ({
		problem: `For every transaction retrieve ID, price and ${item.wording}, naming the processed column ${item.label}.`,
		query: `SELECT t_id, price, ${item.expression} AS ${item.label} FROM transactions`,
		evidence: 'This prepares a report from stored values; the formatting does not establish whether those values are correct.',
		payoff: 'The additional field makes the report readable. The recorded prices still need independent verification before we infer a trend.',
	})),
	explanation: 'Process each row’s value in SELECT and label the derived column with AS.',
	comparisonOptions: { requireEqualColumnNames: true },
})
