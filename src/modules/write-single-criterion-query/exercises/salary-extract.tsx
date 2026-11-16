import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve employee ID, first name, last name and current salary for employees whose current salary is below 150000.',
		query: 'SELECT e_id, first_name, last_name, current_salary FROM employees WHERE current_salary < 150000',
		evidence: 'Noah Chen questions a salary communication. Their signed annual base-salary agreement states $165,000.00. The threshold only locates low recorded salaries.',
		payoff: 'Noah Chen appears with $149,000.00, unlike the signed agreement. We have a concrete discrepancy, not evidence of who edited it.',
	},
	{
		problem: 'Retrieve employee ID, first name, last name and current salary for employees whose current salary is below 100000.',
		query: 'SELECT e_id, first_name, last_name, current_salary FROM employees WHERE current_salary < 100000',
		evidence: 'Priya Desai questions a salary communication. Their signed annual base-salary agreement states $108,000.00. The threshold only locates low recorded salaries.',
		payoff: 'Priya Desai appears with $99,000.00, unlike the signed agreement. We have a concrete discrepancy, not evidence of who edited it.',
	},
	{
		problem: 'Retrieve employee ID, first name, last name and current salary for employees whose current salary is below 145000.',
		query: 'SELECT e_id, first_name, last_name, current_salary FROM employees WHERE current_salary < 145000',
		evidence: 'Aisha Patel questions a salary communication. Their signed annual base-salary agreement states $160,000.00. The threshold only locates low recorded salaries.',
		payoff: 'Aisha Patel appears with $144,000.00, unlike the signed agreement. We have a concrete discrepancy, not evidence of who edited it.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-single-criterion-query-salary-extract',
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
			<Par>Purpose: Inspect a focused salary extract.</Par>
			<Par>Goal: Compare the directory with a signed agreement.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Compare the directory with a signed agreement.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Use a single condition and select only the required fields.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
