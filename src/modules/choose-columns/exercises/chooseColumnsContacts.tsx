import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const solution = `
SELECT
  e_id,
  first_name,
  last_name,
  email,
  phone,
  address
FROM employees;`

export default defineSQLMonoExercise({
	exerciseId: 'choose-columns-directory-review',
	definition: {
		solution,
		comparisonOptions: { requireEqualColumnNames: true },
	},
	component: {
		Problem: () => <>Retrieve the employee ID, first name, last name, email, phone number, and address of every employee.</>,
		Prompt: () => <SpeechBox person="paris">
			<Par>Three internal handoffs failed because the staff directory did not provide usable contact details. I need to see each employee’s identity beside their email, phone number, and address.</Par>
			<Par>Please select only those directory columns, including the employee ID so I can trace each row.</Par>
		</SpeechBox>,
		Payoff: () => <SpeechBox person="paris">
			<Par>There are the gaps: Julia Santos has no email, Gabriel Silva has no phone number, and Luca Bennett has no address. The handoff sheet was not dropping fields—the source records themselves are incomplete.</Par>
			<Par>These are ordinary details, but their absence is already blocking work. Someone needs to explain how three different contact fields disappeared.</Par>
		</SpeechBox>,
	},
})
