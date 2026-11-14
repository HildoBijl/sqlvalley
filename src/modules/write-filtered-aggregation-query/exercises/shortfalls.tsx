import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-filtered-aggregation-query',
	key: 'shortfalls',
	person: 'caesar',
	purpose: 'Find the scope of the weak-looking report.',
	goal: 'Apply a threshold to a grouped difference.',
	variants: [50000, 100000, 200000].map(threshold => ({
		problem: `For fiscal year 2025 Q1 retrieve category and total operating expenses minus total revenue as recorded_shortfall, for categories whose grouped shortfall exceeds ${threshold}.`,
		query: `SELECT category, SUM(operating_expenses) - SUM(revenue) AS recorded_shortfall FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = 'Q1' GROUP BY category HAVING SUM(operating_expenses) - SUM(revenue) > ${threshold}`,
		evidence: 'Signed close statements independently disagree with several stored revenue figures. The threshold is a reporting choice, not a declaration that these categories truly lost money.',
		payoff: 'The report concentrates its apparent shortfalls in particular categories. Together with the retained statements, that gives us a pattern to investigate rather than a sound case against the pivot.',
	})),
	explanation: 'Calculate the grouped difference in both SELECT and HAVING; do not filter individual rows by a group total.',
	comparisonOptions: { requireEqualColumnNames: true },
})
