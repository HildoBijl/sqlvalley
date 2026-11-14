import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'aggregate-columns',
	key: 'status-counts',
	person: 'wheatley',
	purpose: 'Summarize stored transaction activity.',
	goal: 'Distinguish row counts from counts of known prices.',
	variants: [
		{ expression: 'COUNT(*)', alias: 'transaction_count', wording: 'number of transactions' },
		{ expression: 'COUNT(price)', alias: 'priced_count', wording: 'number of transactions with a known price' },
		{ expression: 'COUNT(DISTINCT prod_id)', alias: 'asset_count', wording: 'number of distinct assets appearing in transactions' },
	].map(item => ({
		problem: `For each transaction status retrieve status and the ${item.wording} as ${item.alias}.`,
		query: `SELECT status, ${item.expression} AS ${item.alias} FROM transactions GROUP BY status`,
		evidence: 'The dataset includes an unpriced pending transaction. These are recorded statuses, not a count of successful historical payments.',
		payoff: 'That gives me the grouped activity measure I needed. Different counting expressions answer different questions.',
	})),
	explanation: 'GROUP BY forms one group per status. COUNT(column) ignores NULL, unlike COUNT(*).',
	comparisonOptions: { requireEqualColumnNames: true },
})
