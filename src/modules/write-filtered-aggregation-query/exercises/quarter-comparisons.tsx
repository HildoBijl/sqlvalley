import { performanceCases, sqlLiteral, money } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-filtered-aggregation-query',
	key: 'quarter-comparisons',
	person: 'caesar',
	purpose: 'Compare complete quarters without mixing activity units.',
	goal: 'Use conditional aggregation and filter grouped comparisons.',
	variants: performanceCases.map(item => ({
		problem: `For category ${item.category}, compare revenue in 2024 Q4 and 2025 Q1. Retrieve category, Q4 revenue as previous_revenue and Q1 revenue as current_revenue, retaining only categories where Q1 revenue is lower than Q4 revenue.`,
		query: `SELECT category, SUM(CASE WHEN fiscal_year = 2024 AND quarter = 'Q4' THEN revenue ELSE 0 END) AS previous_revenue, SUM(CASE WHEN fiscal_year = 2025 AND quarter = 'Q1' THEN revenue ELSE 0 END) AS current_revenue FROM quarterly_performance WHERE category = ${sqlLiteral(item.category)} AND ((fiscal_year = 2024 AND quarter = 'Q4') OR (fiscal_year = 2025 AND quarter = 'Q1')) GROUP BY category HAVING SUM(CASE WHEN fiscal_year = 2025 AND quarter = 'Q1' THEN revenue ELSE 0 END) < SUM(CASE WHEN fiscal_year = 2024 AND quarter = 'Q4' THEN revenue ELSE 0 END)`,
		evidence: `These are two complete quarters; exclude partial Q2 2025. The independently signed 2025 Q1 close gives ${item.category} revenue as ${money(item.revenue)}. We compare revenue rather than incompatible pre/post-pivot transaction counts.`,
		payoff: `The stored comparison looks worse because Q1 revenue is recorded as ${money(item.recordedRevenue)}, conflicting with the signed close. We must establish who changed it before attributing a motive or identity.`,
	})),
	explanation: 'Conditional SUM separates the two periods within a category, then HAVING compares the grouped values.',
	comparisonOptions: { requireEqualColumnNames: true },
})
