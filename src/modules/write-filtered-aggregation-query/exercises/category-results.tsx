import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For PAINTING in fiscal year 2025 Q1, retrieve category, total revenue as recorded_revenue and total operating expenses as recorded_costs, but only if grouped revenue is below grouped costs.',
		query: 'SELECT category, SUM(revenue) AS recorded_revenue, SUM(operating_expenses) AS recorded_costs FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = \'Q1\' AND category = \'PAINTING\' GROUP BY category HAVING SUM(revenue) < SUM(operating_expenses)',
		evidence: 'An independently retained signed Q1 close statement gives PAINTING revenue as $1,084,054.00. Compare that with the stored report; sale prices are not the same measure as company revenue.',
		payoff: 'The report records only $108,405.40 of revenue for PAINTING. Its weak-looking result conflicts with the signed close statement, making deliberate interference a serious explanation.',
	},
	{
		problem: 'For SPORTS_MEMORABILIA in fiscal year 2025 Q1, retrieve category, total revenue as recorded_revenue and total operating expenses as recorded_costs, but only if grouped revenue is below grouped costs.',
		query: 'SELECT category, SUM(revenue) AS recorded_revenue, SUM(operating_expenses) AS recorded_costs FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = \'Q1\' AND category = \'SPORTS_MEMORABILIA\' GROUP BY category HAVING SUM(revenue) < SUM(operating_expenses)',
		evidence: 'An independently retained signed Q1 close statement gives SPORTS_MEMORABILIA revenue as $1,171,735.50. Compare that with the stored report; sale prices are not the same measure as company revenue.',
		payoff: 'The report records only $117,173.55 of revenue for SPORTS_MEMORABILIA. Its weak-looking result conflicts with the signed close statement, making deliberate interference a serious explanation.',
	},
	{
		problem: 'For CERAMIC in fiscal year 2025 Q1, retrieve category, total revenue as recorded_revenue and total operating expenses as recorded_costs, but only if grouped revenue is below grouped costs.',
		query: 'SELECT category, SUM(revenue) AS recorded_revenue, SUM(operating_expenses) AS recorded_costs FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = \'Q1\' AND category = \'CERAMIC\' GROUP BY category HAVING SUM(revenue) < SUM(operating_expenses)',
		evidence: 'An independently retained signed Q1 close statement gives CERAMIC revenue as $183,458.00. Compare that with the stored report; sale prices are not the same measure as company revenue.',
		payoff: 'The report records only $18,345.80 of revenue for CERAMIC. Its weak-looking result conflicts with the signed close statement, making deliberate interference a serious explanation.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-filtered-aggregation-query-category-results',
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
			<Par>Purpose: Check a weak-looking quarterly category report.</Par>
			<Par>Goal: Filter source rows before testing grouped performance.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Filter source rows before testing grouped performance.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>WHERE selects the period and category; HAVING tests the totals after grouping.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
