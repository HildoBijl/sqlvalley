import { saleCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-multi-table-query',
	key: 'asset-sales',
	person: 'wheatley',
	purpose: 'Link recorded assets to selected completed deals.',
	goal: 'Compare related values without treating an estimate as proof of wrongdoing.',
	variants: saleCases.map(item => ({
		problem: `Retrieve transaction ID, product name, price and estimated value as estimated_value for COMPLETED transactions in category ${item.category} whose price is less than half the product’s estimated value.`,
		query: `SELECT t.t_id, p.name, t.price, p.est_value AS estimated_value FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = 'COMPLETED' AND p.category = ${sqlLiteral(item.category)} AND t.price < p.est_value * 0.5`,
		evidence: 'This confidential report compares stored sale values and current estimates. Neither a low recorded value nor a client relationship proves criminality.',
		payoff: 'Those are the recorded asset-and-deal relationships I needed. The estimate is a screening reference, not evidence that a client did anything wrong.',
	})),
	explanation: 'Join the product to its transaction before applying status, category and cross-table value conditions.',
	comparisonOptions: { requireEqualColumnNames: true },
})
