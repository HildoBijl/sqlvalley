import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For COMPLETED transactions priced below 139500, retrieve transaction ID, price and 5% of price rounded to two decimals as estimated_fee.',
		query: 'SELECT t_id, price, ROUND(price * 0.05, 2) AS estimated_fee FROM transactions WHERE status = \'COMPLETED\' AND price < 139500',
		evidence: 'Transaction 25031001 was queried by commercial staff. The 5% fee is a hypothetical rate used only for this report.',
		payoff: 'The selected estimate includes the questioned sale. The arithmetic can be correct even when the input price is wrong; actual company revenue requires separate evidence.',
	},
	{
		problem: 'For COMPLETED transactions priced below 139500, retrieve transaction ID, price and 10% of price rounded to two decimals as estimated_fee.',
		query: 'SELECT t_id, price, ROUND(price * 0.1, 2) AS estimated_fee FROM transactions WHERE status = \'COMPLETED\' AND price < 139500',
		evidence: 'Transaction 25031001 was queried by commercial staff. The 10% fee is a hypothetical rate used only for this report.',
		payoff: 'The selected estimate includes the questioned sale. The arithmetic can be correct even when the input price is wrong; actual company revenue requires separate evidence.',
	},
	{
		problem: 'For COMPLETED transactions priced below 186500, retrieve transaction ID, price and 5% of price rounded to two decimals as estimated_fee.',
		query: 'SELECT t_id, price, ROUND(price * 0.05, 2) AS estimated_fee FROM transactions WHERE status = \'COMPLETED\' AND price < 186500',
		evidence: 'Transaction 25031204 was queried by commercial staff. The 5% fee is a hypothetical rate used only for this report.',
		payoff: 'The selected estimate includes the questioned sale. The arithmetic can be correct even when the input price is wrong; actual company revenue requires separate evidence.',
	},
	{
		problem: 'For COMPLETED transactions priced below 186500, retrieve transaction ID, price and 10% of price rounded to two decimals as estimated_fee.',
		query: 'SELECT t_id, price, ROUND(price * 0.1, 2) AS estimated_fee FROM transactions WHERE status = \'COMPLETED\' AND price < 186500',
		evidence: 'Transaction 25031204 was queried by commercial staff. The 10% fee is a hypothetical rate used only for this report.',
		payoff: 'The selected estimate includes the questioned sale. The arithmetic can be correct even when the input price is wrong; actual company revenue requires separate evidence.',
	},
	{
		problem: 'For COMPLETED transactions priced below 386100, retrieve transaction ID, price and 5% of price rounded to two decimals as estimated_fee.',
		query: 'SELECT t_id, price, ROUND(price * 0.05, 2) AS estimated_fee FROM transactions WHERE status = \'COMPLETED\' AND price < 386100',
		evidence: 'Transaction 25041119 was queried by commercial staff. The 5% fee is a hypothetical rate used only for this report.',
		payoff: 'The selected estimate includes the questioned sale. The arithmetic can be correct even when the input price is wrong; actual company revenue requires separate evidence.',
	},
	{
		problem: 'For COMPLETED transactions priced below 386100, retrieve transaction ID, price and 10% of price rounded to two decimals as estimated_fee.',
		query: 'SELECT t_id, price, ROUND(price * 0.1, 2) AS estimated_fee FROM transactions WHERE status = \'COMPLETED\' AND price < 386100',
		evidence: 'Transaction 25041119 was queried by commercial staff. The 10% fee is a hypothetical rate used only for this report.',
		payoff: 'The selected estimate includes the questioned sale. The arithmetic can be correct even when the input price is wrong; actual company revenue requires separate evidence.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-single-table-query-sale-estimates',
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
			<Par>Purpose: Calculate the implications of a selected report.</Par>
			<Par>Goal: Use an explicit rate without presenting estimates as earned fees.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Use an explicit rate without presenting estimates as earned fees.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Apply both conditions to the source rows and calculate the named expression in SELECT.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
