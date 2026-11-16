import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve employee ID, first name, last name, contract start date, end date and status for employee 72738553 and contract start date 2024-01-22.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, c.start_date, c.end_date, c.status FROM employees AS e JOIN contracts AS c ON e.e_id = c.e_id WHERE e.e_id = 72738553 AND c.start_date = \'2024-01-22\'',
		evidence: 'The independently retained approval for Noah Chen states SICK_LEAVE for 2024-01-22 through 2024-01-26. The employee disputes its treatment.',
		payoff: 'The joined leave row belongs to Noah Chen and records PTO, unlike the approval. This is a concrete staff-facing mismatch; it is not proof Marcelle caused it.',
	},
	{
		problem: 'Retrieve employee ID, first name, last name, contract start date, end date and status for employee 47132966 and contract start date 2023-12-11.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, c.start_date, c.end_date, c.status FROM employees AS e JOIN contracts AS c ON e.e_id = c.e_id WHERE e.e_id = 47132966 AND c.start_date = \'2023-12-11\'',
		evidence: 'The independently retained approval for Priya Desai states PTO for 2023-12-11 through 2023-12-15. The employee disputes its treatment.',
		payoff: 'The joined leave row belongs to Priya Desai and records SICK_LEAVE, unlike the approval. This is a concrete staff-facing mismatch; it is not proof Marcelle caused it.',
	},
	{
		problem: 'Retrieve employee ID, first name, last name, contract start date, end date and status for employee 69733054 and contract start date 2024-04-22.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, c.start_date, c.end_date, c.status FROM employees AS e JOIN contracts AS c ON e.e_id = c.e_id WHERE e.e_id = 69733054 AND c.start_date = \'2024-04-22\'',
		evidence: 'The independently retained approval for Aisha Patel states SICK_LEAVE for 2024-04-22 through 2024-04-26. The employee disputes its treatment.',
		payoff: 'The joined leave row belongs to Aisha Patel and records PTO, unlike the approval. This is a concrete staff-facing mismatch; it is not proof Marcelle caused it.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-join-tables-leave-comparison',
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
			<Par>Purpose: Link a disputed leave row to the affected staff member.</Par>
			<Par>Goal: Compare the joined record with the approved leave reference.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Compare the joined record with the approved leave reference.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Join identity to the dated contract using the employee key, then isolate the referenced leave row.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
