import { saleCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-multi-table-query',
	key: 'universal-sales',
	person: 'wheatley',
	purpose: 'Find assets meeting a condition across all relevant sales.',
	goal: 'Require relevant activity and exclude every counterexample.',
	variants: saleCases.map(item => ({
		problem: `Retrieve product ID and name for ${item.category} assets with at least one COMPLETED transaction and no COMPLETED transaction priced above 150% of the current estimated value.`,
		query: `SELECT p.p_id, p.name FROM products AS p WHERE p.category = ${sqlLiteral(item.category)} AND EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = 'COMPLETED') AND NOT EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = 'COMPLETED' AND (t.price IS NULL OR t.price > p.est_value * 1.5)) AND p.est_value IS NOT NULL`,
		evidence: 'Require known estimates and known completed-sale prices. Assets with no completed transaction must not qualify. Current ownership is not historical sale ownership.',
		payoff: 'Every included asset has relevant completed activity and no disqualifying recorded sale. That is the relationship test I asked for, not a judgment about its owners.',
	})),
	explanation: 'EXISTS rules out vacuous matches. NOT EXISTS excludes a counterexample; unknown values cannot establish the required condition.',
})
