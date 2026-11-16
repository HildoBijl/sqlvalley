import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve employee ID, first name and last name for the employee listed as approver on expense 509901.',
		query: 'SELECT e_id, first_name, last_name FROM employees WHERE e_id = (SELECT approved_by FROM expenses WHERE exp_id = 509901)',
		evidence: 'Expense 509901 is the earlier request for Database support - invoice LS-184. The department wants to compare its expected authorization with the later request.',
		payoff: 'The earlier entry names the expected approver. The later entry’s different or missing authorization remains unexplained; neither field records the data-entry actor.',
	},
	{
		problem: 'Retrieve employee ID, first name and last name for the employee listed as approver on expense 509903.',
		query: 'SELECT e_id, first_name, last_name FROM employees WHERE e_id = (SELECT approved_by FROM expenses WHERE exp_id = 509903)',
		evidence: 'Expense 509903 is the earlier request for Provenance services - invoice LS-227. The department wants to compare its expected authorization with the later request.',
		payoff: 'The earlier entry names the expected approver. The later entry’s different or missing authorization remains unexplained; neither field records the data-entry actor.',
	},
	{
		problem: 'Retrieve employee ID, first name and last name for the employee listed as approver on expense 509905.',
		query: 'SELECT e_id, first_name, last_name FROM employees WHERE e_id = (SELECT approved_by FROM expenses WHERE exp_id = 509905)',
		evidence: 'Expense 509905 is the earlier request for Platform support - invoice LS-316. The department wants to compare its expected authorization with the later request.',
		payoff: 'The earlier entry names the expected approver. The later entry’s different or missing authorization remains unexplained; neither field records the data-entry actor.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-lookup-query-approvers',
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
			<Par>Purpose: Look up a specific request’s listed authorization.</Par>
			<Par>Goal: Use a uniquely identified scalar lookup.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Use a uniquely identified scalar lookup.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>The expense primary key guarantees at most one value for the scalar subquery.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
