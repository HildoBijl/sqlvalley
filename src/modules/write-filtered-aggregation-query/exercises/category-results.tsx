import { performanceCases, sqlLiteral, money } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-filtered-aggregation-query',
	key: 'category-results',
	person: 'caesar',
	purpose: 'Check a weak-looking quarterly category report.',
	goal: 'Filter source rows before testing grouped performance.',
	variants: performanceCases.map(item => ({
		problem: `For ${item.category} in fiscal year 2025 Q1, retrieve category, total revenue as recorded_revenue and total operating expenses as recorded_costs, but only if grouped revenue is below grouped costs.`,
		query: `SELECT category, SUM(revenue) AS recorded_revenue, SUM(operating_expenses) AS recorded_costs FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = 'Q1' AND category = ${sqlLiteral(item.category)} GROUP BY category HAVING SUM(revenue) < SUM(operating_expenses)`,
		evidence: `An independently retained signed Q1 close statement gives ${item.category} revenue as ${money(item.revenue)}. Compare that with the stored report; sale prices are not the same measure as company revenue.`,
		payoff: `The report records only ${money(item.recordedRevenue)} of revenue for ${item.category}. Its weak-looking result conflicts with the signed close statement, making deliberate interference a serious explanation.`,
	})),
	explanation: 'WHERE selects the period and category; HAVING tests the totals after grouping.',
	comparisonOptions: { requireEqualColumnNames: true },
})
