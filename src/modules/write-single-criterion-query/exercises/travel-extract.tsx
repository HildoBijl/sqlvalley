import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve employee ID, first name, last name and city for employees whose city is New York, NY.',
		query: 'SELECT e_id, first_name, last_name, city FROM employees WHERE city = \'New York, NY\'',
		evidence: 'Noah Chen supplied a verified claim based in San Jose, CA, but the processing notice used New York, NY.',
		payoff: 'The directory places Noah Chen in New York, NY. That provides an explanation for the processing discrepancy, but not its author.',
	},
	{
		problem: 'Retrieve employee ID, first name, last name and city for employees whose city is Boston, MA.',
		query: 'SELECT e_id, first_name, last_name, city FROM employees WHERE city = \'Boston, MA\'',
		evidence: 'Priya Desai supplied a verified claim based in Fremont, CA, but the processing notice used Boston, MA.',
		payoff: 'The directory places Priya Desai in Boston, MA. That provides an explanation for the processing discrepancy, but not its author.',
	},
	{
		problem: 'Retrieve employee ID, first name, last name and city for employees whose city is Miami, FL.',
		query: 'SELECT e_id, first_name, last_name, city FROM employees WHERE city = \'Miami, FL\'',
		evidence: 'Aisha Patel supplied a verified claim based in Palo Alto, CA, but the processing notice used Miami, FL.',
		payoff: 'The directory places Aisha Patel in Miami, FL. That provides an explanation for the processing discrepancy, but not its author.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-single-criterion-query-travel-extract',
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
			<Par>Purpose: Inspect the location used for a travel claim.</Par>
			<Par>Goal: Locate recorded values that conflict with verified staff information.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Locate recorded values that conflict with verified staff information.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Select relevant directory fields after one equality filter.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
