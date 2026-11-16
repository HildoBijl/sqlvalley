import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For every transaction retrieve ID, price and the year and month as YYYY-MM, naming the processed column transaction_month.',
		query: 'SELECT t_id, price, SUBSTR(date_time, 1, 7) AS transaction_month FROM transactions',
		evidence: 'This prepares a report from stored values; the formatting does not establish whether those values are correct.',
		payoff: 'The additional field makes the report readable. The recorded prices still need independent verification before we infer a trend.',
	},
	{
		problem: 'For every transaction retrieve ID, price and the status in uppercase, naming the processed column status_label.',
		query: 'SELECT t_id, price, UPPER(status) AS status_label FROM transactions',
		evidence: 'This prepares a report from stored values; the formatting does not establish whether those values are correct.',
		payoff: 'The additional field makes the report readable. The recorded prices still need independent verification before we infer a trend.',
	},
	{
		problem: 'For every transaction retrieve ID, price and the transaction year as text, naming the processed column transaction_year.',
		query: 'SELECT t_id, price, STRFTIME(\'%Y\', date_time) AS transaction_year FROM transactions',
		evidence: 'This prepares a report from stored values; the formatting does not establish whether those values are correct.',
		payoff: 'The additional field makes the report readable. The recorded prices still need independent verification before we infer a trend.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-process-columns-report-fields',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
		comparisonOptions: {requireEqualColumnNames:true},
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Prepare a readable transaction report.</Par>
			<Par>Goal: Show recorded prices beside processed date or status fields.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Show recorded prices beside processed date or status fields.</Par>
			<SpeechBox person="bob"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Process each row’s value in SELECT and label the derived column with AS.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
