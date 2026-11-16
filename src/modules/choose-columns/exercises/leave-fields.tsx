import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve employee ID, start date, end date and status from every contract. Rename status to leave_category.',
		query: 'SELECT e_id, start_date, end_date, status AS leave_category FROM contracts',
		evidence: 'The approved leave for Noah Chen, employee 72738553, starting 2024-01-22, was SICK_LEAVE. Staff say it has been treated differently.',
		payoff: 'The leave row records PTO, unlike the approval’s SICK_LEAVE. We have a specific discrepancy to follow up.',
	},
	{
		problem: 'Retrieve employee ID, start date, end date and status from every contract. Rename status to leave_category.',
		query: 'SELECT e_id, start_date, end_date, status AS leave_category FROM contracts',
		evidence: 'The approved leave for Priya Desai, employee 47132966, starting 2023-12-11, was PTO. Staff say it has been treated differently.',
		payoff: 'The leave row records SICK_LEAVE, unlike the approval’s PTO. We have a specific discrepancy to follow up.',
	},
	{
		problem: 'Retrieve employee ID, start date, end date and status from every contract. Rename status to leave_category.',
		query: 'SELECT e_id, start_date, end_date, status AS leave_category FROM contracts',
		evidence: 'The approved leave for Aisha Patel, employee 69733054, starting 2024-04-22, was SICK_LEAVE. Staff say it has been treated differently.',
		payoff: 'The leave row records PTO, unlike the approval’s SICK_LEAVE. We have a specific discrepancy to follow up.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-choose-columns-leave-fields',
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
			<Par>Purpose: Prepare a leave handoff with clear field names.</Par>
			<Par>Goal: Compare a stored status with an independently approved leave request.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Compare a stored status with an independently approved leave request.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>AS changes the output heading; it does not change stored data.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
