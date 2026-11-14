import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'aggregate-columns',
	key: 'quarter-totals',
	person: 'wheatley',
	purpose: 'Summarize category-quarter records.',
	goal: 'Aggregate comparable fields while retaining reporting periods.',
	variants: [
		{ field: 'revenue', alias: 'recorded_revenue' },
		{ field: 'operating_expenses', alias: 'recorded_costs' },
		{ field: 'total_transactions', alias: 'recorded_activity' },
	].map(item => ({
		problem: `For each fiscal year and quarter retrieve fiscal_year, quarter and the sum of ${item.field} as ${item.alias}.`,
		query: `SELECT fiscal_year, quarter, SUM(${item.field}) AS ${item.alias} FROM quarterly_performance GROUP BY fiscal_year, quarter`,
		evidence: 'The preview contains fewer categories than the full dataset. Q2 2025 is partial through April 30; activity units changed at the pivot, so do not infer growth from these totals.',
		payoff: 'These are the stored totals for the selected dataset. They are not independent validation of the business results, and partial periods need their own interpretation.',
	})),
	explanation: 'Group by both period fields before summing category records.',
	comparisonOptions: { requireEqualColumnNames: true },
})
