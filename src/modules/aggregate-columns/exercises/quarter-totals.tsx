import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For each fiscal year and quarter retrieve fiscal_year, quarter and the sum of revenue as recorded_revenue.',
		query: 'SELECT fiscal_year, quarter, SUM(revenue) AS recorded_revenue FROM quarterly_performance GROUP BY fiscal_year, quarter',
		evidence: 'The preview contains fewer categories than the full dataset. Q2 2025 is partial through April 30; activity units changed at the pivot, so do not infer growth from these totals.',
		payoff: 'These are the stored totals for the selected dataset. They are not independent validation of the business results, and partial periods need their own interpretation.',
	},
	{
		problem: 'For each fiscal year and quarter retrieve fiscal_year, quarter and the sum of operating_expenses as recorded_costs.',
		query: 'SELECT fiscal_year, quarter, SUM(operating_expenses) AS recorded_costs FROM quarterly_performance GROUP BY fiscal_year, quarter',
		evidence: 'The preview contains fewer categories than the full dataset. Q2 2025 is partial through April 30; activity units changed at the pivot, so do not infer growth from these totals.',
		payoff: 'These are the stored totals for the selected dataset. They are not independent validation of the business results, and partial periods need their own interpretation.',
	},
	{
		problem: 'For each fiscal year and quarter retrieve fiscal_year, quarter and the sum of total_transactions as recorded_activity.',
		query: 'SELECT fiscal_year, quarter, SUM(total_transactions) AS recorded_activity FROM quarterly_performance GROUP BY fiscal_year, quarter',
		evidence: 'The preview contains fewer categories than the full dataset. Q2 2025 is partial through April 30; activity units changed at the pivot, so do not infer growth from these totals.',
		payoff: 'These are the stored totals for the selected dataset. They are not independent validation of the business results, and partial periods need their own interpretation.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-aggregate-columns-quarter-totals',
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
			<Par>Purpose: Summarize category-quarter records.</Par>
			<Par>Goal: Aggregate comparable fields while retaining reporting periods.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Aggregate comparable fields while retaining reporting periods.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Group by both period fields before summing category records.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
