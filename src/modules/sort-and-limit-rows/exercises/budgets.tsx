import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all departments ordered by budget ASC, with unknown budgets last, then department ID ascending.',
		query: 'SELECT * FROM departments ORDER BY budget ASC NULLS LAST, d_id ASC',
		evidence: 'The requested internal report uses smallest budgets first.',
		payoff: 'That is the ordering I needed for the internal brief. I’ll take the report from here.',
	},
	{
		problem: 'Retrieve all departments ordered by budget DESC, with unknown budgets last, then department ID ascending.',
		query: 'SELECT * FROM departments ORDER BY budget DESC NULLS LAST, d_id ASC',
		evidence: 'The requested internal report uses largest budgets first.',
		payoff: 'That is the ordering I needed for the internal brief. I’ll take the report from here.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-sort-and-limit-rows-budgets',
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
			<Par>Purpose: Prepare a ranked department report.</Par>
			<Par>Goal: Return the requested order with deterministic ties.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Return the requested order with deterministic ties.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Specify direction and null placement. The unique department ID resolves equal budgets.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
