import { sample } from '@step-wise/js-utils'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		field: 'city',
		table: 'employees',
		target: 'cities recorded for employees',
		setup: 'Travel reimbursements have spiked, including claims for trips that supposedly begin on the East Coast. Nobody on our staff is based there.',
		payoff: 'The directory contains no East Coast city. Those claims are not being generated from where our employees are actually recorded as living.',
	},
	{
		field: 'e_id',
		table: 'contracts',
		target: 'employee IDs represented in the contracts table',
		setup: 'Several employees say their salaries have not arrived, but Payroll cannot find their contract records. I want to know which employee IDs the contracts table recognizes at all.',
		payoff: 'The complainants’ employee IDs never appear in the contract list. That explains why Payroll cannot process them, but not why their records are missing.',
	},
	{
		field: 'status',
		table: 'contracts',
		target: 'contract statuses, without duplicates',
		setup: 'Employees on parental leave say Payroll treated their time away incorrectly. I need to check whether that leave category exists in the contract records.',
		payoff: 'PARENTAL_LEAVE never appears in the recorded statuses. If the category is missing, those contracts cannot be represented correctly.',
	},
] as const

const requestOpeners = [
	'Could you',
	'Can I ask you to',
	'I need you to',
	'Help me',
] as const

const reactionOpeners = [
	'There it is—',
	'That’s so odd.',
	'Huh.',
	'I thought so.',
] as const

const suspicions = [
	'Someone must have mishandled these records. This is not normal.',
	'I want to believe this is an ordinary mistake, but we need to keep checking.',
	'Whose fault is this? A routine list should not be this unreliable.',
] as const

export default defineSQLMonoExercise({
	exerciseId: 'choose-columns-distinct-values',
	definition: {
		generateParameters: () => ({
			variant: sample(variants),
			requestOpener: sample(requestOpeners),
			reactionOpener: sample(reactionOpeners),
			suspicion: sample(suspicions),
		}),
		getSolution: ({ parameters }) => ({
			query: `
SELECT DISTINCT ${parameters.variant.field}
FROM ${parameters.variant.table};`,
		}),
	},
	component: {
		Problem: ({ parameters }) => <>Retrieve all {parameters.variant.target}.</>,
		Prompt: ({ parameters }) => <SpeechBox person="paris">
			<Par>{parameters.variant.setup}</Par>
			<Par>{parameters.requestOpener} retrieve all {parameters.variant.target}?</Par>
		</SpeechBox>,
		Payoff: ({ parameters }) => <SpeechBox person="paris">
			<Par>{parameters.reactionOpener} {parameters.variant.payoff}</Par>
			<Par>{parameters.suspicion}</Par>
		</SpeechBox>,
	},
})
