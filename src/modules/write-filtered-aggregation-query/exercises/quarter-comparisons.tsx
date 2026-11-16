import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For category PAINTING, compare revenue in 2024 Q4 and 2025 Q1. Retrieve category, Q4 revenue as previous_revenue and Q1 revenue as current_revenue, retaining only categories where Q1 revenue is lower than Q4 revenue.',
		query: 'SELECT category, SUM(CASE WHEN fiscal_year = 2024 AND quarter = \'Q4\' THEN revenue ELSE 0 END) AS previous_revenue, SUM(CASE WHEN fiscal_year = 2025 AND quarter = \'Q1\' THEN revenue ELSE 0 END) AS current_revenue FROM quarterly_performance WHERE category = \'PAINTING\' AND ((fiscal_year = 2024 AND quarter = \'Q4\') OR (fiscal_year = 2025 AND quarter = \'Q1\')) GROUP BY category HAVING SUM(CASE WHEN fiscal_year = 2025 AND quarter = \'Q1\' THEN revenue ELSE 0 END) < SUM(CASE WHEN fiscal_year = 2024 AND quarter = \'Q4\' THEN revenue ELSE 0 END)',
		evidence: 'These are two complete quarters; exclude partial Q2 2025. The independently signed 2025 Q1 close gives PAINTING revenue as $1,084,054.00. We compare revenue rather than incompatible pre/post-pivot transaction counts.',
		payoff: 'The stored comparison looks worse because Q1 revenue is recorded as $108,405.40, conflicting with the signed close. We must establish who changed it before attributing a motive or identity.',
	},
	{
		problem: 'For category SPORTS_MEMORABILIA, compare revenue in 2024 Q4 and 2025 Q1. Retrieve category, Q4 revenue as previous_revenue and Q1 revenue as current_revenue, retaining only categories where Q1 revenue is lower than Q4 revenue.',
		query: 'SELECT category, SUM(CASE WHEN fiscal_year = 2024 AND quarter = \'Q4\' THEN revenue ELSE 0 END) AS previous_revenue, SUM(CASE WHEN fiscal_year = 2025 AND quarter = \'Q1\' THEN revenue ELSE 0 END) AS current_revenue FROM quarterly_performance WHERE category = \'SPORTS_MEMORABILIA\' AND ((fiscal_year = 2024 AND quarter = \'Q4\') OR (fiscal_year = 2025 AND quarter = \'Q1\')) GROUP BY category HAVING SUM(CASE WHEN fiscal_year = 2025 AND quarter = \'Q1\' THEN revenue ELSE 0 END) < SUM(CASE WHEN fiscal_year = 2024 AND quarter = \'Q4\' THEN revenue ELSE 0 END)',
		evidence: 'These are two complete quarters; exclude partial Q2 2025. The independently signed 2025 Q1 close gives SPORTS_MEMORABILIA revenue as $1,171,735.50. We compare revenue rather than incompatible pre/post-pivot transaction counts.',
		payoff: 'The stored comparison looks worse because Q1 revenue is recorded as $117,173.55, conflicting with the signed close. We must establish who changed it before attributing a motive or identity.',
	},
	{
		problem: 'For category CERAMIC, compare revenue in 2024 Q4 and 2025 Q1. Retrieve category, Q4 revenue as previous_revenue and Q1 revenue as current_revenue, retaining only categories where Q1 revenue is lower than Q4 revenue.',
		query: 'SELECT category, SUM(CASE WHEN fiscal_year = 2024 AND quarter = \'Q4\' THEN revenue ELSE 0 END) AS previous_revenue, SUM(CASE WHEN fiscal_year = 2025 AND quarter = \'Q1\' THEN revenue ELSE 0 END) AS current_revenue FROM quarterly_performance WHERE category = \'CERAMIC\' AND ((fiscal_year = 2024 AND quarter = \'Q4\') OR (fiscal_year = 2025 AND quarter = \'Q1\')) GROUP BY category HAVING SUM(CASE WHEN fiscal_year = 2025 AND quarter = \'Q1\' THEN revenue ELSE 0 END) < SUM(CASE WHEN fiscal_year = 2024 AND quarter = \'Q4\' THEN revenue ELSE 0 END)',
		evidence: 'These are two complete quarters; exclude partial Q2 2025. The independently signed 2025 Q1 close gives CERAMIC revenue as $183,458.00. We compare revenue rather than incompatible pre/post-pivot transaction counts.',
		payoff: 'The stored comparison looks worse because Q1 revenue is recorded as $18,345.80, conflicting with the signed close. We must establish who changed it before attributing a motive or identity.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-filtered-aggregation-query-quarter-comparisons',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
		comparisonOptions: {requireEqualColumnNames:true},
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Compare complete quarters without mixing activity units.</Par>
			<Par>Goal: Use conditional aggregation and filter grouped comparisons.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Use conditional aggregation and filter grouped comparisons.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Conditional SUM separates the two periods within a category, then HAVING compares the grouped values.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
