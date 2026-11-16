import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve product ID and name for PAINTING assets with at least one COMPLETED transaction and no COMPLETED transaction priced above 150% of the current estimated value.',
		query: 'SELECT p.p_id, p.name FROM products AS p WHERE p.category = \'PAINTING\' AND EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = \'COMPLETED\') AND NOT EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = \'COMPLETED\' AND (t.price IS NULL OR t.price > p.est_value * 1.5)) AND p.est_value IS NOT NULL',
		evidence: 'Require known estimates and known completed-sale prices. Assets with no completed transaction must not qualify. Current ownership is not historical sale ownership.',
		payoff: 'Every included asset has relevant completed activity and no disqualifying recorded sale. That is the relationship test I asked for, not a judgment about its owners.',
	},
	{
		problem: 'Retrieve product ID and name for CERAMIC assets with at least one COMPLETED transaction and no COMPLETED transaction priced above 150% of the current estimated value.',
		query: 'SELECT p.p_id, p.name FROM products AS p WHERE p.category = \'CERAMIC\' AND EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = \'COMPLETED\') AND NOT EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = \'COMPLETED\' AND (t.price IS NULL OR t.price > p.est_value * 1.5)) AND p.est_value IS NOT NULL',
		evidence: 'Require known estimates and known completed-sale prices. Assets with no completed transaction must not qualify. Current ownership is not historical sale ownership.',
		payoff: 'Every included asset has relevant completed activity and no disqualifying recorded sale. That is the relationship test I asked for, not a judgment about its owners.',
	},
	{
		problem: 'Retrieve product ID and name for HISTORIC_OBJECT assets with at least one COMPLETED transaction and no COMPLETED transaction priced above 150% of the current estimated value.',
		query: 'SELECT p.p_id, p.name FROM products AS p WHERE p.category = \'HISTORIC_OBJECT\' AND EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = \'COMPLETED\') AND NOT EXISTS (SELECT 1 FROM transactions AS t WHERE t.prod_id = p.p_id AND t.status = \'COMPLETED\' AND (t.price IS NULL OR t.price > p.est_value * 1.5)) AND p.est_value IS NOT NULL',
		evidence: 'Require known estimates and known completed-sale prices. Assets with no completed transaction must not qualify. Current ownership is not historical sale ownership.',
		payoff: 'Every included asset has relevant completed activity and no disqualifying recorded sale. That is the relationship test I asked for, not a judgment about its owners.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-multi-table-query-universal-sales',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Find assets meeting a condition across all relevant sales.</Par>
			<Par>Goal: Require relevant activity and exclude every counterexample.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Require relevant activity and exclude every counterexample.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>EXISTS rules out vacuous matches. NOT EXISTS excludes a counterexample; unknown values cannot establish the required condition.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
