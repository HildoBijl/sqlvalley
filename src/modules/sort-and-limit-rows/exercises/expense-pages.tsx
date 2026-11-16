import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve 3 expenses after skipping the first 0, ordered by amount descending with unknowns last, then expense ID ascending.',
		query: 'SELECT * FROM expenses ORDER BY amount DESC NULLS LAST, exp_id ASC LIMIT 3 OFFSET 0',
		evidence: 'This is a page request, not a claim that a particular expense is suspicious. Preview and full-data rankings may differ.',
		payoff: 'That is the page I asked for. The ranking gives me the selected internal records.',
	},
	{
		problem: 'Retrieve 5 expenses after skipping the first 2, ordered by amount descending with unknowns last, then expense ID ascending.',
		query: 'SELECT * FROM expenses ORDER BY amount DESC NULLS LAST, exp_id ASC LIMIT 5 OFFSET 2',
		evidence: 'This is a page request, not a claim that a particular expense is suspicious. Preview and full-data rankings may differ.',
		payoff: 'That is the page I asked for. The ranking gives me the selected internal records.',
	},
	{
		problem: 'Retrieve 4 expenses after skipping the first 1, ordered by amount descending with unknowns last, then expense ID ascending.',
		query: 'SELECT * FROM expenses ORDER BY amount DESC NULLS LAST, exp_id ASC LIMIT 4 OFFSET 1',
		evidence: 'This is a page request, not a claim that a particular expense is suspicious. Preview and full-data rankings may differ.',
		payoff: 'That is the page I asked for. The ranking gives me the selected internal records.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-sort-and-limit-rows-expense-pages',
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
			<Par>Purpose: Extract a page of an ordered spending report.</Par>
			<Par>Goal: Apply sorting, limits and offsets consistently.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Apply sorting, limits and offsets consistently.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>ORDER BY defines the order before OFFSET skips rows and LIMIT keeps the requested page.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
