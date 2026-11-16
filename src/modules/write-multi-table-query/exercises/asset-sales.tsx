import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve transaction ID, product name, price and estimated value as estimated_value for COMPLETED transactions in category PAINTING whose price is less than half the product’s estimated value.',
		query: 'SELECT t.t_id, p.name, t.price, p.est_value AS estimated_value FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = \'COMPLETED\' AND p.category = \'PAINTING\' AND t.price < p.est_value * 0.5',
		evidence: 'This confidential report compares stored sale values and current estimates. Neither a low recorded value nor a client relationship proves criminality.',
		payoff: 'Those are the recorded asset-and-deal relationships I needed. The estimate is a screening reference, not evidence that a client did anything wrong.',
	},
	{
		problem: 'Retrieve transaction ID, product name, price and estimated value as estimated_value for COMPLETED transactions in category CERAMIC whose price is less than half the product’s estimated value.',
		query: 'SELECT t.t_id, p.name, t.price, p.est_value AS estimated_value FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = \'COMPLETED\' AND p.category = \'CERAMIC\' AND t.price < p.est_value * 0.5',
		evidence: 'This confidential report compares stored sale values and current estimates. Neither a low recorded value nor a client relationship proves criminality.',
		payoff: 'Those are the recorded asset-and-deal relationships I needed. The estimate is a screening reference, not evidence that a client did anything wrong.',
	},
	{
		problem: 'Retrieve transaction ID, product name, price and estimated value as estimated_value for COMPLETED transactions in category HISTORIC_OBJECT whose price is less than half the product’s estimated value.',
		query: 'SELECT t.t_id, p.name, t.price, p.est_value AS estimated_value FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = \'COMPLETED\' AND p.category = \'HISTORIC_OBJECT\' AND t.price < p.est_value * 0.5',
		evidence: 'This confidential report compares stored sale values and current estimates. Neither a low recorded value nor a client relationship proves criminality.',
		payoff: 'Those are the recorded asset-and-deal relationships I needed. The estimate is a screening reference, not evidence that a client did anything wrong.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-multi-table-query-asset-sales',
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
			<Par>Purpose: Link recorded assets to selected completed deals.</Par>
			<Par>Goal: Compare related values without treating an estimate as proof of wrongdoing.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Compare related values without treating an estimate as proof of wrongdoing.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Join the product to its transaction before applying status, category and cross-table value conditions.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
