import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve transaction ID, product ID and price for COMPLETED transactions priced below 139500, ordered by price ascending and transaction ID ascending.',
		query: 'SELECT t_id, prod_id, price FROM transactions WHERE status = \'COMPLETED\' AND price < 139500 ORDER BY price ASC, t_id ASC',
		evidence: 'Commercial staff queried the recorded outcome of transaction 25031001. This threshold locates low recorded deals rather than defining a financial loss.',
		payoff: 'Transaction 25031001 appears among the low recorded deals. This extract does not establish that the underlying sale really closed at that price.',
	},
	{
		problem: 'Retrieve transaction ID, product ID and price for COMPLETED transactions priced below 186500, ordered by price ascending and transaction ID ascending.',
		query: 'SELECT t_id, prod_id, price FROM transactions WHERE status = \'COMPLETED\' AND price < 186500 ORDER BY price ASC, t_id ASC',
		evidence: 'Commercial staff queried the recorded outcome of transaction 25031204. This threshold locates low recorded deals rather than defining a financial loss.',
		payoff: 'Transaction 25031204 appears among the low recorded deals. This extract does not establish that the underlying sale really closed at that price.',
	},
	{
		problem: 'Retrieve transaction ID, product ID and price for COMPLETED transactions priced below 386100, ordered by price ascending and transaction ID ascending.',
		query: 'SELECT t_id, prod_id, price FROM transactions WHERE status = \'COMPLETED\' AND price < 386100 ORDER BY price ASC, t_id ASC',
		evidence: 'Commercial staff queried the recorded outcome of transaction 25041119. This threshold locates low recorded deals rather than defining a financial loss.',
		payoff: 'Transaction 25041119 appears among the low recorded deals. This extract does not establish that the underlying sale really closed at that price.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-single-table-query-selected-sales',
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
			<Par>Purpose: Prepare a scoped commercial extract.</Par>
			<Par>Goal: Combine projection, filtering and deterministic ordering.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Combine projection, filtering and deterministic ordering.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Select the requested fields, combine the two conditions, and use a unique tie-breaker for the ordered result.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
