import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve all expenses for department 2200 whose approver is either unknown or different from employee 14338498.',
		query: 'SELECT * FROM expenses WHERE d_id = 2200 AND (approved_by IS NULL OR NOT (approved_by = 14338498))',
		evidence: 'The department expected employee 14338498 to approve Database support - invoice LS-184. A listed approver does not identify the person who entered the request.',
		payoff: 'The later disputed request has an unexpected or absent approval. This is a control discrepancy worth investigating, not proof of who created the row.',
	},
	{
		problem: 'Retrieve all expenses for department 4100 whose approver is either unknown or different from employee 60706330.',
		query: 'SELECT * FROM expenses WHERE d_id = 4100 AND (approved_by IS NULL OR NOT (approved_by = 60706330))',
		evidence: 'The department expected employee 60706330 to approve Provenance services - invoice LS-227. A listed approver does not identify the person who entered the request.',
		payoff: 'The later disputed request has an unexpected or absent approval. This is a control discrepancy worth investigating, not proof of who created the row.',
	},
	{
		problem: 'Retrieve all expenses for department 2100 whose approver is either unknown or different from employee 14338498.',
		query: 'SELECT * FROM expenses WHERE d_id = 2100 AND (approved_by IS NULL OR NOT (approved_by = 14338498))',
		evidence: 'The department expected employee 14338498 to approve Platform support - invoice LS-316. A listed approver does not identify the person who entered the request.',
		payoff: 'The later disputed request has an unexpected or absent approval. This is a control discrepancy worth investigating, not proof of who created the row.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-filter-rows-on-multiple-criteria-approval-conditions',
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
			<Par>Purpose: Inspect exceptional authorization fields.</Par>
			<Par>Goal: Combine grouped alternatives, negation and NULL tests.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Combine grouped alternatives, negation and NULL tests.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Parenthesize the alternatives so the department condition applies to both. Include IS NULL because ordinary comparisons do not match unknown values.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
