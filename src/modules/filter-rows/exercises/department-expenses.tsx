import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all expenses charged to department 2200.',
		query: 'SELECT * FROM expenses WHERE d_id = 2200',
		evidence: 'Department 2200 cannot reconcile its budget usage. Its signed supplier paperwork lists one $12,500.00 charge for Database support - invoice LS-184.',
		payoff: 'The list includes repeated entries for Database support - invoice LS-184. We should reconcile those requests with the supplier paperwork; a request is not a payment.',
	},
	{
		problem: 'Retrieve all expenses charged to department 4100.',
		query: 'SELECT * FROM expenses WHERE d_id = 4100',
		evidence: 'Department 4100 cannot reconcile its budget usage. Its signed supplier paperwork lists one $17,600.00 charge for Provenance services - invoice LS-227.',
		payoff: 'The list includes repeated entries for Provenance services - invoice LS-227. We should reconcile those requests with the supplier paperwork; a request is not a payment.',
	},
	{
		problem: 'Retrieve all expenses charged to department 2100.',
		query: 'SELECT * FROM expenses WHERE d_id = 2100',
		evidence: 'Department 2100 cannot reconcile its budget usage. Its signed supplier paperwork lists one $18,750.00 charge for Platform support - invoice LS-316.',
		payoff: 'The list includes repeated entries for Platform support - invoice LS-316. We should reconcile those requests with the supplier paperwork; a request is not a payment.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-filter-rows-department-expenses',
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
			<Par>Purpose: Locate expenses behind a departmental complaint.</Par>
			<Par>Goal: Inspect recorded requests without claiming they were paid.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Inspect recorded requests without claiming they were paid.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Use one equality condition to retain the department’s expense rows.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
