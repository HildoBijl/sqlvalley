import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve the employee ID, first name, last name and email for every employee.',
		query: 'SELECT e_id, first_name, last_name, email FROM employees',
		evidence: 'Noah Chen did not receive a staff notification. Their independently confirmed email is n.chen@herishare.com.',
		payoff: 'The recorded email for Noah Chen is missing. That explains the failed handoff, but not who changed the entry.',
	},
	{
		problem: 'Retrieve the employee ID, first name, last name and phone for every employee.',
		query: 'SELECT e_id, first_name, last_name, phone FROM employees',
		evidence: 'Priya Desai did not receive a staff notification. Their independently confirmed phone is 510-748-3023.',
		payoff: 'The recorded phone for Priya Desai is missing. That explains the failed handoff, but not who changed the entry.',
	},
	{
		problem: 'Retrieve the employee ID, first name, last name and email for every employee.',
		query: 'SELECT e_id, first_name, last_name, email FROM employees',
		evidence: 'Aisha Patel did not receive a staff notification. Their independently confirmed email is a.patel@herishare.com.',
		payoff: 'The recorded email for Aisha Patel is missing. That explains the failed handoff, but not who changed the entry.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-choose-columns-contacts',
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
			<Par>Purpose: Inspect the contact channel behind a failed notification.</Par>
			<Par>Goal: Compare the recorded channel with staff-confirmed information.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Compare the recorded channel with staff-confirmed information.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Select the required fields without filtering; compare the relevant row with the supplied reference.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
