import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For every transaction retrieve its ID, price and 5% of price rounded to two decimals as estimated_commission.',
		query: 'SELECT t_id, price, ROUND(price * 0.05, 2) AS estimated_commission FROM transactions',
		evidence: 'The 5% rate is an explicit hypothetical assumption. The report includes all transaction statuses and is not a record of fees earned.',
		payoff: 'The estimates follow from the recorded prices. We should verify those prices before treating this as actual commercial performance.',
	},
	{
		problem: 'For every transaction retrieve its ID, price and 8% of price rounded to two decimals as estimated_commission.',
		query: 'SELECT t_id, price, ROUND(price * 0.08, 2) AS estimated_commission FROM transactions',
		evidence: 'The 8% rate is an explicit hypothetical assumption. The report includes all transaction statuses and is not a record of fees earned.',
		payoff: 'The estimates follow from the recorded prices. We should verify those prices before treating this as actual commercial performance.',
	},
	{
		problem: 'For every transaction retrieve its ID, price and 10% of price rounded to two decimals as estimated_commission.',
		query: 'SELECT t_id, price, ROUND(price * 0.1, 2) AS estimated_commission FROM transactions',
		evidence: 'The 10% rate is an explicit hypothetical assumption. The report includes all transaction statuses and is not a record of fees earned.',
		payoff: 'The estimates follow from the recorded prices. We should verify those prices before treating this as actual commercial performance.',
	},
	{
		problem: 'For every transaction retrieve its ID, price and 12% of price rounded to two decimals as estimated_commission.',
		query: 'SELECT t_id, price, ROUND(price * 0.12, 2) AS estimated_commission FROM transactions',
		evidence: 'The 12% rate is an explicit hypothetical assumption. The report includes all transaction statuses and is not a record of fees earned.',
		payoff: 'The estimates follow from the recorded prices. We should verify those prices before treating this as actual commercial performance.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-process-columns-commissions',
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
			<Par>Purpose: Calculate an illustrative commission.</Par>
			<Par>Goal: Keep hypothetical fees separate from actual company revenue.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Keep hypothetical fees separate from actual company revenue.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Multiply by the stated rate and ROUND the result. A missing price produces a missing estimate.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
