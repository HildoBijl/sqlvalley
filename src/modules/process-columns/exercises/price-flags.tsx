import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'process-columns',
	key: 'price-flags',
	person: 'bob',
	purpose: 'Flag recorded values for follow-up.',
	goal: 'Handle conditions and missing source values explicitly.',
	variants: [
		...[100000, 500000, 1000000].map(threshold => ({
			problem: `For every transaction retrieve ID, price, and a price_band equal to MISSING if price is unknown, LOW if price is below ${threshold}, and OTHER otherwise.`,
			query: `SELECT t_id, price, CASE WHEN price IS NULL THEN 'MISSING' WHEN price < ${threshold} THEN 'LOW' ELSE 'OTHER' END AS price_band FROM transactions`,
			evidence: `The ${threshold} threshold is a report aid, not a valuation. A pending transaction is deliberately unpriced.`,
			payoff: 'The flags describe recorded price bands and explicitly distinguish an unknown price. They do not establish a financial loss.',
		})),
		{ problem: 'Retrieve every transaction ID and price, using zero when price is unknown, as display_price.', query: 'SELECT t_id, COALESCE(price, 0) AS display_price FROM transactions', evidence: 'Zero is a presentation fallback for a deliberately unpriced pending record; it does not mean the asset was sold for zero.', payoff: 'The fallback fills the report’s missing display value without changing the database or establishing a sale price.' },
	],
	explanation: 'CASE selects the first matching branch; COALESCE supplies a fallback for an unknown value.',
	comparisonOptions: { requireEqualColumnNames: true },
})
