import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all expenses whose description contains invoice LS- and whose amount is at least 12500 but less than 13500.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-%\' AND amount >= 12500 AND amount < 13500',
		evidence: 'The purchase paperwork lists one service invoice for Database support - invoice LS-184. Use the reference and this amount window to find the competing requests.',
		payoff: 'The two requests share the reference and amount window. A repeat service can be legitimate, so the source invoice and authorization still matter.',
	},
	{
		problem: 'Retrieve all expenses whose description contains invoice LS- and whose amount is greater than 11500 but less than 13500.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-%\' AND amount > 11500 AND amount < 13500',
		evidence: 'The purchase paperwork lists one service invoice for Database support - invoice LS-184. Use the reference and this amount window to find the competing requests.',
		payoff: 'The two requests share the reference and amount window. A repeat service can be legitimate, so the source invoice and authorization still matter.',
	},
	{
		problem: 'Retrieve all expenses whose description contains invoice LS- and whose amount is at least 17600 but less than 18600.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-%\' AND amount >= 17600 AND amount < 18600',
		evidence: 'The purchase paperwork lists one service invoice for Provenance services - invoice LS-227. Use the reference and this amount window to find the competing requests.',
		payoff: 'The two requests share the reference and amount window. A repeat service can be legitimate, so the source invoice and authorization still matter.',
	},
	{
		problem: 'Retrieve all expenses whose description contains invoice LS- and whose amount is greater than 16600 but less than 18600.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-%\' AND amount > 16600 AND amount < 18600',
		evidence: 'The purchase paperwork lists one service invoice for Provenance services - invoice LS-227. Use the reference and this amount window to find the competing requests.',
		payoff: 'The two requests share the reference and amount window. A repeat service can be legitimate, so the source invoice and authorization still matter.',
	},
	{
		problem: 'Retrieve all expenses whose description contains invoice LS- and whose amount is at least 18750 but less than 19750.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-%\' AND amount >= 18750 AND amount < 19750',
		evidence: 'The purchase paperwork lists one service invoice for Platform support - invoice LS-316. Use the reference and this amount window to find the competing requests.',
		payoff: 'The two requests share the reference and amount window. A repeat service can be legitimate, so the source invoice and authorization still matter.',
	},
	{
		problem: 'Retrieve all expenses whose description contains invoice LS- and whose amount is greater than 17750 but less than 19750.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-%\' AND amount > 17750 AND amount < 19750',
		evidence: 'The purchase paperwork lists one service invoice for Platform support - invoice LS-316. Use the reference and this amount window to find the competing requests.',
		payoff: 'The two requests share the reference and amount window. A repeat service can be legitimate, so the source invoice and authorization still matter.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-filter-rows-on-multiple-criteria-expense-ranges',
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
			<Par>Purpose: Separate a disputed service from unrelated spending.</Par>
			<Par>Goal: Combine text matching with numeric boundaries.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Combine text matching with numeric boundaries.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>All conditions must hold: the reference, the lower boundary and the upper boundary.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
