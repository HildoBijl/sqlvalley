import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve employee ID, position, start date, end date and status for contracts whose status is PTO.',
		query: 'SELECT e_id, position, start_date, end_date, status FROM contracts WHERE status = \'PTO\'',
		evidence: 'Noah Chen, employee 72738553, supplied approval for SICK_LEAVE starting 2024-01-22, but staff reported PTO.',
		payoff: 'The selected rows include that leave record classified as PTO. A legitimate overlapping employment row is not itself an error.',
	},
	{
		problem: 'Retrieve employee ID, position, start date, end date and status for contracts whose status is SICK_LEAVE.',
		query: 'SELECT e_id, position, start_date, end_date, status FROM contracts WHERE status = \'SICK_LEAVE\'',
		evidence: 'Priya Desai, employee 47132966, supplied approval for PTO starting 2023-12-11, but staff reported SICK_LEAVE.',
		payoff: 'The selected rows include that leave record classified as SICK_LEAVE. A legitimate overlapping employment row is not itself an error.',
	},
	{
		problem: 'Retrieve employee ID, position, start date, end date and status for contracts whose status is PTO.',
		query: 'SELECT e_id, position, start_date, end_date, status FROM contracts WHERE status = \'PTO\'',
		evidence: 'Aisha Patel, employee 69733054, supplied approval for SICK_LEAVE starting 2024-04-22, but staff reported PTO.',
		payoff: 'The selected rows include that leave record classified as PTO. A legitimate overlapping employment row is not itself an error.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-single-criterion-query-leave-extract',
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
			<Par>Purpose: Inspect a disputed leave status.</Par>
			<Par>Goal: Compare the recorded category with an approved request.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Compare the recorded category with an approved request.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Filter on one status value, retaining the date fields needed to locate the referenced leave.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
