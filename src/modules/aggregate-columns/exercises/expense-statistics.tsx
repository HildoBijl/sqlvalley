import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For each department represented in expenses, retrieve department ID and the average expense amount as average_amount.',
		query: 'SELECT d_id, AVG(amount) AS average_amount FROM expenses GROUP BY d_id',
		evidence: 'These summarize recorded requests. They do not establish actual payments, payment recipients or the person entering a request.',
		payoff: 'The cost-centre summaries are ready. I only needed the internal distribution for this part of the brief.',
	},
	{
		problem: 'For each department represented in expenses, retrieve department ID and the minimum expense amount as minimum_amount.',
		query: 'SELECT d_id, MIN(amount) AS minimum_amount FROM expenses GROUP BY d_id',
		evidence: 'These summarize recorded requests. They do not establish actual payments, payment recipients or the person entering a request.',
		payoff: 'The cost-centre summaries are ready. I only needed the internal distribution for this part of the brief.',
	},
	{
		problem: 'For each department represented in expenses, retrieve department ID and the maximum expense amount as maximum_amount.',
		query: 'SELECT d_id, MAX(amount) AS maximum_amount FROM expenses GROUP BY d_id',
		evidence: 'These summarize recorded requests. They do not establish actual payments, payment recipients or the person entering a request.',
		payoff: 'The cost-centre summaries are ready. I only needed the internal distribution for this part of the brief.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-aggregate-columns-expense-statistics',
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
			<Par>Purpose: Summarize the expense-request distribution.</Par>
			<Par>Goal: Use different aggregate measures for each cost centre.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Use different aggregate measures for each cost centre.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Group expenses by department and apply the requested aggregate to amount.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
