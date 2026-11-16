import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all expenses whose amount is greater than $11,500.00.',
		query: 'SELECT * FROM expenses WHERE amount > 11500',
		evidence: 'A department is querying Database support - invoice LS-184, recorded at $12,500.00. The threshold is only a way to locate potentially relevant requests.',
		payoff: 'Both entries for that reference meet the requested amount condition. An amount threshold by itself says nothing about whether a payment was legitimate.',
	},
	{
		problem: 'Retrieve all expenses whose amount is at most $12,500.00.',
		query: 'SELECT * FROM expenses WHERE amount <= 12500',
		evidence: 'A department is querying Database support - invoice LS-184, recorded at $12,500.00. The threshold is only a way to locate potentially relevant requests.',
		payoff: 'Both entries for that reference meet the requested amount condition. An amount threshold by itself says nothing about whether a payment was legitimate.',
	},
	{
		problem: 'Retrieve all expenses whose amount is greater than $16,600.00.',
		query: 'SELECT * FROM expenses WHERE amount > 16600',
		evidence: 'A department is querying Provenance services - invoice LS-227, recorded at $17,600.00. The threshold is only a way to locate potentially relevant requests.',
		payoff: 'Both entries for that reference meet the requested amount condition. An amount threshold by itself says nothing about whether a payment was legitimate.',
	},
	{
		problem: 'Retrieve all expenses whose amount is at most $17,600.00.',
		query: 'SELECT * FROM expenses WHERE amount <= 17600',
		evidence: 'A department is querying Provenance services - invoice LS-227, recorded at $17,600.00. The threshold is only a way to locate potentially relevant requests.',
		payoff: 'Both entries for that reference meet the requested amount condition. An amount threshold by itself says nothing about whether a payment was legitimate.',
	},
	{
		problem: 'Retrieve all expenses whose amount is greater than $17,750.00.',
		query: 'SELECT * FROM expenses WHERE amount > 17750',
		evidence: 'A department is querying Platform support - invoice LS-316, recorded at $18,750.00. The threshold is only a way to locate potentially relevant requests.',
		payoff: 'Both entries for that reference meet the requested amount condition. An amount threshold by itself says nothing about whether a payment was legitimate.',
	},
	{
		problem: 'Retrieve all expenses whose amount is at most $18,750.00.',
		query: 'SELECT * FROM expenses WHERE amount <= 18750',
		evidence: 'A department is querying Platform support - invoice LS-316, recorded at $18,750.00. The threshold is only a way to locate potentially relevant requests.',
		payoff: 'Both entries for that reference meet the requested amount condition. An amount threshold by itself says nothing about whether a payment was legitimate.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-filter-rows-amounts',
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
			<Par>Purpose: Isolate expenses by amount.</Par>
			<Par>Goal: Locate the reported charge among other requests.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Locate the reported charge among other requests.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Compare the numeric amount with the supplied threshold; return every matching row.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
