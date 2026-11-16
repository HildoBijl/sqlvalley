import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve department ID and name for departments with at least one expense whose description is exactly Database support - invoice LS-184.',
		query: 'SELECT d_id, d_name FROM departments AS d WHERE EXISTS (SELECT 1 FROM expenses AS x WHERE x.d_id = d.d_id AND x.description = \'Database support - invoice LS-184\')',
		evidence: 'The budget holder needs the recorded cost centre before comparing request entries with retained purchase paperwork.',
		payoff: 'This identifies the cost centre charged in the request list. A department reference does not establish who entered or received money from a request.',
	},
	{
		problem: 'Retrieve department ID and name for departments with at least one expense whose description is exactly Provenance services - invoice LS-227.',
		query: 'SELECT d_id, d_name FROM departments AS d WHERE EXISTS (SELECT 1 FROM expenses AS x WHERE x.d_id = d.d_id AND x.description = \'Provenance services - invoice LS-227\')',
		evidence: 'The budget holder needs the recorded cost centre before comparing request entries with retained purchase paperwork.',
		payoff: 'This identifies the cost centre charged in the request list. A department reference does not establish who entered or received money from a request.',
	},
	{
		problem: 'Retrieve department ID and name for departments with at least one expense whose description is exactly Platform support - invoice LS-316.',
		query: 'SELECT d_id, d_name FROM departments AS d WHERE EXISTS (SELECT 1 FROM expenses AS x WHERE x.d_id = d.d_id AND x.description = \'Platform support - invoice LS-316\')',
		evidence: 'The budget holder needs the recorded cost centre before comparing request entries with retained purchase paperwork.',
		payoff: 'This identifies the cost centre charged in the request list. A department reference does not establish who entered or received money from a request.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-lookup-query-cost-centres',
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
			<Par>Purpose: Identify the cost centre tied to the disputed requests.</Par>
			<Par>Goal: Use a correlated existence condition.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Use a correlated existence condition.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>The correlated subquery checks for a matching expense for each outer department.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
