import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'process-columns',
	key: 'commissions',
	person: 'bob',
	purpose: 'Calculate an illustrative commission.',
	goal: 'Keep hypothetical fees separate from actual company revenue.',
	variants: [0.05, 0.08, 0.1, 0.12].map(rate => ({
		problem: `For every transaction retrieve its ID, price and ${rate * 100}% of price rounded to two decimals as estimated_commission.`,
		query: `SELECT t_id, price, ROUND(price * ${rate}, 2) AS estimated_commission FROM transactions`,
		evidence: `The ${rate * 100}% rate is an explicit hypothetical assumption. The report includes all transaction statuses and is not a record of fees earned.`,
		payoff: 'The estimates follow from the recorded prices. We should verify those prices before treating this as actual commercial performance.',
	})),
	explanation: 'Multiply by the stated rate and ROUND the result. A missing price produces a missing estimate.',
	comparisonOptions: { requireEqualColumnNames: true },
})
