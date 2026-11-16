import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all contracts ordered by end date ASC with unknown end dates LAST, then employee ID and start date ascending.',
		query: 'SELECT * FROM contracts ORDER BY end_date ASC NULLS LAST, e_id ASC, start_date ASC',
		evidence: 'An open leave row can overlap an open employment row. The request is for ordering, not a classification of who is currently working.',
		payoff: 'The open-ended and historical rows are arranged as requested. That gives me the internal sequence I needed.',
	},
	{
		problem: 'Retrieve all contracts ordered by end date DESC with unknown end dates FIRST, then employee ID and start date ascending.',
		query: 'SELECT * FROM contracts ORDER BY end_date DESC NULLS FIRST, e_id ASC, start_date ASC',
		evidence: 'An open leave row can overlap an open employment row. The request is for ordering, not a classification of who is currently working.',
		payoff: 'The open-ended and historical rows are arranged as requested. That gives me the internal sequence I needed.',
	},
	{
		problem: 'Retrieve all contracts ordered by end date ASC with unknown end dates FIRST, then employee ID and start date ascending.',
		query: 'SELECT * FROM contracts ORDER BY end_date ASC NULLS FIRST, e_id ASC, start_date ASC',
		evidence: 'An open leave row can overlap an open employment row. The request is for ordering, not a classification of who is currently working.',
		payoff: 'The open-ended and historical rows are arranged as requested. That gives me the internal sequence I needed.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-sort-and-limit-rows-contract-endings',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
		comparisonOptions: {requireEqualRowOrder:true},
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Order employment history explicitly.</Par>
			<Par>Goal: Place unknown end dates and break ties predictably.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Place unknown end dates and break ties predictably.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Use the two primary-key fields to resolve otherwise equal end dates.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
