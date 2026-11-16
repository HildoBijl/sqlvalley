import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all expenses whose description contains invoice LS-184.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-184%\'',
		evidence: 'The department retained one supplier invoice for Database support - invoice LS-184, but its spending report is difficult to reconcile.',
		payoff: 'The matching request rows let us compare dates, amounts and approval fields. Repeated descriptions need checking; they do not prove money moved.',
	},
	{
		problem: 'Retrieve all expenses whose description contains invoice LS-227.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-227%\'',
		evidence: 'The department retained one supplier invoice for Provenance services - invoice LS-227, but its spending report is difficult to reconcile.',
		payoff: 'The matching request rows let us compare dates, amounts and approval fields. Repeated descriptions need checking; they do not prove money moved.',
	},
	{
		problem: 'Retrieve all expenses whose description contains invoice LS-316.',
		query: 'SELECT * FROM expenses WHERE description LIKE \'%invoice LS-316%\'',
		evidence: 'The department retained one supplier invoice for Platform support - invoice LS-316, but its spending report is difficult to reconcile.',
		payoff: 'The matching request rows let us compare dates, amounts and approval fields. Repeated descriptions need checking; they do not prove money moved.',
	},
	{
		problem: 'Retrieve all expenses whose approver is unknown.',
		query: 'SELECT * FROM expenses WHERE approved_by IS NULL',
		evidence: 'Staff following up a purchase cannot find its expected approval. An unknown approval is a review lead rather than proof of misconduct.',
		payoff: 'These are the entries with an unknown approver, including the disputed request. We still need the source authorization.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-filter-rows-descriptions',
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
			<Par>Purpose: Find a request that staff cannot reconcile.</Par>
			<Par>Goal: Use description patterns or unknown approvals as leads.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Use description patterns or unknown approvals as leads.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>LIKE can match a reference inside text. IS NULL tests an unknown value; equality to NULL does not.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
