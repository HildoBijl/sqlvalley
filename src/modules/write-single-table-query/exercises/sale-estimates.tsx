import { saleCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-single-table-query',
	key: 'sale-estimates',
	person: 'bob',
	purpose: 'Calculate the implications of a selected report.',
	goal: 'Use an explicit rate without presenting estimates as earned fees.',
	variants: saleCases.flatMap(item => [0.05, 0.1].map(rate => ({
		problem: `For COMPLETED transactions priced below ${item.recordedPrice + 100000}, retrieve transaction ID, price and ${rate * 100}% of price rounded to two decimals as estimated_fee.`,
		query: `SELECT t_id, price, ROUND(price * ${rate}, 2) AS estimated_fee FROM transactions WHERE status = 'COMPLETED' AND price < ${item.recordedPrice + 100000}`,
		evidence: `Transaction ${item.id} was queried by commercial staff. The ${rate * 100}% fee is a hypothetical rate used only for this report.`,
		payoff: `The selected estimate includes the questioned sale. The arithmetic can be correct even when the input price is wrong; actual company revenue requires separate evidence.`,
	}))),
	explanation: 'Apply both conditions to the source rows and calculate the named expression in SELECT.',
	comparisonOptions: { requireEqualColumnNames: true },
})
