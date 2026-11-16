import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve employee ID, first name and last name for employees listed as requesters on expenses with description exactly Database support - invoice LS-184.',
		query: 'SELECT e_id, first_name, last_name FROM employees WHERE e_id IN (SELECT requested_by FROM expenses WHERE description = \'Database support - invoice LS-184\')',
		evidence: 'The department has one retained service invoice but multiple request records. The requester field is an operational reference, not an edit log.',
		payoff: 'The named employee says they requested the service once. Their identity gives us a witness to ask, not the identity of the person who inserted a second request.',
	},
	{
		problem: 'Retrieve employee ID, first name and last name for employees listed as requesters on expenses with description exactly Provenance services - invoice LS-227.',
		query: 'SELECT e_id, first_name, last_name FROM employees WHERE e_id IN (SELECT requested_by FROM expenses WHERE description = \'Provenance services - invoice LS-227\')',
		evidence: 'The department has one retained service invoice but multiple request records. The requester field is an operational reference, not an edit log.',
		payoff: 'The named employee says they requested the service once. Their identity gives us a witness to ask, not the identity of the person who inserted a second request.',
	},
	{
		problem: 'Retrieve employee ID, first name and last name for employees listed as requesters on expenses with description exactly Platform support - invoice LS-316.',
		query: 'SELECT e_id, first_name, last_name FROM employees WHERE e_id IN (SELECT requested_by FROM expenses WHERE description = \'Platform support - invoice LS-316\')',
		evidence: 'The department has one retained service invoice but multiple request records. The requester field is an operational reference, not an edit log.',
		payoff: 'The named employee says they requested the service once. Their identity gives us a witness to ask, not the identity of the person who inserted a second request.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-lookup-query-requesters',
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
			<Par>Purpose: Identify the recorded requester of a disputed service.</Par>
			<Par>Goal: Use membership lookup without confusing responsibility with authorship.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Use membership lookup without confusing responsibility with authorship.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>IN checks membership in the requester IDs returned by the inner query.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
