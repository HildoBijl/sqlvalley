import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'aggregate-columns',
	key: 'expense-statistics',
	person: 'wheatley',
	purpose: 'Summarize the expense-request distribution.',
	goal: 'Use different aggregate measures for each cost centre.',
	variants: [
		{ fn: 'AVG', alias: 'average_amount', wording: 'average' },
		{ fn: 'MIN', alias: 'minimum_amount', wording: 'minimum' },
		{ fn: 'MAX', alias: 'maximum_amount', wording: 'maximum' },
	].map(item => ({
		problem: `For each department represented in expenses, retrieve department ID and the ${item.wording} expense amount as ${item.alias}.`,
		query: `SELECT d_id, ${item.fn}(amount) AS ${item.alias} FROM expenses GROUP BY d_id`,
		evidence: 'These summarize recorded requests. They do not establish actual payments, payment recipients or the person entering a request.',
		payoff: 'The cost-centre summaries are ready. I only needed the internal distribution for this part of the brief.',
	})),
	explanation: 'Group expenses by department and apply the requested aggregate to amount.',
	comparisonOptions: { requireEqualColumnNames: true },
})
