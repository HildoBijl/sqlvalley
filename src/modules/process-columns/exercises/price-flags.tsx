import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For every transaction retrieve ID, price, and a price_band equal to MISSING if price is unknown, LOW if price is below 100000, and OTHER otherwise.',
		query: 'SELECT t_id, price, CASE WHEN price IS NULL THEN \'MISSING\' WHEN price < 100000 THEN \'LOW\' ELSE \'OTHER\' END AS price_band FROM transactions',
		evidence: 'The 100000 threshold is a report aid, not a valuation. A pending transaction is deliberately unpriced.',
		payoff: 'The flags describe recorded price bands and explicitly distinguish an unknown price. They do not establish a financial loss.',
	},
	{
		problem: 'For every transaction retrieve ID, price, and a price_band equal to MISSING if price is unknown, LOW if price is below 500000, and OTHER otherwise.',
		query: 'SELECT t_id, price, CASE WHEN price IS NULL THEN \'MISSING\' WHEN price < 500000 THEN \'LOW\' ELSE \'OTHER\' END AS price_band FROM transactions',
		evidence: 'The 500000 threshold is a report aid, not a valuation. A pending transaction is deliberately unpriced.',
		payoff: 'The flags describe recorded price bands and explicitly distinguish an unknown price. They do not establish a financial loss.',
	},
	{
		problem: 'For every transaction retrieve ID, price, and a price_band equal to MISSING if price is unknown, LOW if price is below 1000000, and OTHER otherwise.',
		query: 'SELECT t_id, price, CASE WHEN price IS NULL THEN \'MISSING\' WHEN price < 1000000 THEN \'LOW\' ELSE \'OTHER\' END AS price_band FROM transactions',
		evidence: 'The 1000000 threshold is a report aid, not a valuation. A pending transaction is deliberately unpriced.',
		payoff: 'The flags describe recorded price bands and explicitly distinguish an unknown price. They do not establish a financial loss.',
	},
	{
		problem: 'Retrieve every transaction ID and price, using zero when price is unknown, as display_price.',
		query: 'SELECT t_id, COALESCE(price, 0) AS display_price FROM transactions',
		evidence: 'Zero is a presentation fallback for a deliberately unpriced pending record; it does not mean the asset was sold for zero.',
		payoff: 'The fallback fills the report’s missing display value without changing the database or establishing a sale price.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-process-columns-price-flags',
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
			<Par>Purpose: Flag recorded values for follow-up.</Par>
			<Par>Goal: Handle conditions and missing source values explicitly.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Handle conditions and missing source values explicitly.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>CASE selects the first matching branch; COALESCE supplies a fallback for an unknown value.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
