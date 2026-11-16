import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For fiscal year 2025 Q1 retrieve category and total operating expenses minus total revenue as recorded_shortfall, for categories whose grouped shortfall exceeds 50000.',
		query: 'SELECT category, SUM(operating_expenses) - SUM(revenue) AS recorded_shortfall FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = \'Q1\' GROUP BY category HAVING SUM(operating_expenses) - SUM(revenue) > 50000',
		evidence: 'Signed close statements independently disagree with several stored revenue figures. The threshold is a reporting choice, not a declaration that these categories truly lost money.',
		payoff: 'The report concentrates its apparent shortfalls in particular categories. Together with the retained statements, that gives us a pattern to investigate rather than a sound case against the pivot.',
	},
	{
		problem: 'For fiscal year 2025 Q1 retrieve category and total operating expenses minus total revenue as recorded_shortfall, for categories whose grouped shortfall exceeds 100000.',
		query: 'SELECT category, SUM(operating_expenses) - SUM(revenue) AS recorded_shortfall FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = \'Q1\' GROUP BY category HAVING SUM(operating_expenses) - SUM(revenue) > 100000',
		evidence: 'Signed close statements independently disagree with several stored revenue figures. The threshold is a reporting choice, not a declaration that these categories truly lost money.',
		payoff: 'The report concentrates its apparent shortfalls in particular categories. Together with the retained statements, that gives us a pattern to investigate rather than a sound case against the pivot.',
	},
	{
		problem: 'For fiscal year 2025 Q1 retrieve category and total operating expenses minus total revenue as recorded_shortfall, for categories whose grouped shortfall exceeds 200000.',
		query: 'SELECT category, SUM(operating_expenses) - SUM(revenue) AS recorded_shortfall FROM quarterly_performance WHERE fiscal_year = 2025 AND quarter = \'Q1\' GROUP BY category HAVING SUM(operating_expenses) - SUM(revenue) > 200000',
		evidence: 'Signed close statements independently disagree with several stored revenue figures. The threshold is a reporting choice, not a declaration that these categories truly lost money.',
		payoff: 'The report concentrates its apparent shortfalls in particular categories. Together with the retained statements, that gives us a pattern to investigate rather than a sound case against the pivot.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-filtered-aggregation-query-shortfalls',
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
			<Par>Purpose: Find the scope of the weak-looking report.</Par>
			<Par>Goal: Apply a threshold to a grouped difference.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Apply a threshold to a grouped difference.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Calculate the grouped difference in both SELECT and HAVING; do not filter individual rows by a group total.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
