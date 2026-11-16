import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all expenses for department 2200 dated from 2025-02-03 through 2025-02-21, inclusive.',
		query: 'SELECT * FROM expenses WHERE d_id = 2200 AND date >= \'2025-02-03\' AND date <= \'2025-02-21\'',
		evidence: 'The department retained one invoice for Database support - invoice LS-184. These dates bracket the disputed reporting period.',
		payoff: 'Both same-reference requests appear in the selected period. That is a reconciliation problem; these rows alone do not prove that either request was paid.',
	},
	{
		problem: 'Retrieve all expenses for department 4100 dated from 2025-03-03 through 2025-03-21, inclusive.',
		query: 'SELECT * FROM expenses WHERE d_id = 4100 AND date >= \'2025-03-03\' AND date <= \'2025-03-21\'',
		evidence: 'The department retained one invoice for Provenance services - invoice LS-227. These dates bracket the disputed reporting period.',
		payoff: 'Both same-reference requests appear in the selected period. That is a reconciliation problem; these rows alone do not prove that either request was paid.',
	},
	{
		problem: 'Retrieve all expenses for department 2100 dated from 2025-04-02 through 2025-04-11, inclusive.',
		query: 'SELECT * FROM expenses WHERE d_id = 2100 AND date >= \'2025-04-02\' AND date <= \'2025-04-11\'',
		evidence: 'The department retained one invoice for Platform support - invoice LS-316. These dates bracket the disputed reporting period.',
		payoff: 'Both same-reference requests appear in the selected period. That is a reconciliation problem; these rows alone do not prove that either request was paid.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-filter-rows-on-multiple-criteria-expense-periods',
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
			<Par>Purpose: Narrow the disputed departmental requests.</Par>
			<Par>Goal: Combine department and date conditions.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Combine department and date conditions.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Combine the department with both inclusive date boundaries using AND.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
