import { saleCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-single-table-query',
	key: 'selected-sales',
	person: 'caesar',
	purpose: 'Prepare a scoped commercial extract.',
	goal: 'Combine projection, filtering and deterministic ordering.',
	variants: saleCases.map(item => ({
		problem: `Retrieve transaction ID, product ID and price for COMPLETED transactions priced below ${item.recordedPrice + 100000}, ordered by price ascending and transaction ID ascending.`,
		query: `SELECT t_id, prod_id, price FROM transactions WHERE status = 'COMPLETED' AND price < ${item.recordedPrice + 100000} ORDER BY price ASC, t_id ASC`,
		evidence: `Commercial staff queried the recorded outcome of transaction ${item.id}. This threshold locates low recorded deals rather than defining a financial loss.`,
		payoff: `Transaction ${item.id} appears among the low recorded deals. This extract does not establish that the underlying sale really closed at that price.`,
	})),
	explanation: 'Select the requested fields, combine the two conditions, and use a unique tie-breaker for the ordered result.',
	comparisonOptions: { requireEqualRowOrder: true },
})
