import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve every distinct city recorded in the employee directory.',
		query: 'SELECT DISTINCT city FROM employees',
		evidence: 'Noah Chen supplied a verified travel claim based in San Jose, CA, but the processing notice used New York, NY.',
		payoff: 'New York, NY appears in the directory. This could explain the travel-processing result; the distinct list alone does not identify an employee or editor.',
	},
	{
		problem: 'Retrieve every distinct city recorded in the employee directory.',
		query: 'SELECT DISTINCT city FROM employees',
		evidence: 'Priya Desai supplied a verified travel claim based in Fremont, CA, but the processing notice used Boston, MA.',
		payoff: 'Boston, MA appears in the directory. This could explain the travel-processing result; the distinct list alone does not identify an employee or editor.',
	},
	{
		problem: 'Retrieve every distinct city recorded in the employee directory.',
		query: 'SELECT DISTINCT city FROM employees',
		evidence: 'Aisha Patel supplied a verified travel claim based in Palo Alto, CA, but the processing notice used Miami, FL.',
		payoff: 'Miami, FL appears in the directory. This could explain the travel-processing result; the distinct list alone does not identify an employee or editor.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-choose-columns-cities',
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
			<Par>Purpose: Inspect the location values used for travel administration.</Par>
			<Par>Goal: Find the recorded city while keeping attribution open.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Find the recorded city while keeping attribution open.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>DISTINCT removes repeated city values. The separate verified claim supplies context for the unexpected value.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
