import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For each transaction status retrieve status and the number of transactions as transaction_count.',
		query: 'SELECT status, COUNT(*) AS transaction_count FROM transactions GROUP BY status',
		evidence: 'The dataset includes an unpriced pending transaction. These are recorded statuses, not a count of successful historical payments.',
		payoff: 'That gives me the grouped activity measure I needed. Different counting expressions answer different questions.',
	},
	{
		problem: 'For each transaction status retrieve status and the number of transactions with a known price as priced_count.',
		query: 'SELECT status, COUNT(price) AS priced_count FROM transactions GROUP BY status',
		evidence: 'The dataset includes an unpriced pending transaction. These are recorded statuses, not a count of successful historical payments.',
		payoff: 'That gives me the grouped activity measure I needed. Different counting expressions answer different questions.',
	},
	{
		problem: 'For each transaction status retrieve status and the number of distinct assets appearing in transactions as asset_count.',
		query: 'SELECT status, COUNT(DISTINCT prod_id) AS asset_count FROM transactions GROUP BY status',
		evidence: 'The dataset includes an unpriced pending transaction. These are recorded statuses, not a count of successful historical payments.',
		payoff: 'That gives me the grouped activity measure I needed. Different counting expressions answer different questions.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-aggregate-columns-status-counts',
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
			<Par>Purpose: Summarize stored transaction activity.</Par>
			<Par>Goal: Distinguish row counts from counts of known prices.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Distinguish row counts from counts of known prices.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>GROUP BY forms one group per status. COUNT(column) ignores NULL, unlike COUNT(*).</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
