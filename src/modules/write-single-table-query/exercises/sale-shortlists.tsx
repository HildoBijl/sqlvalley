import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve transaction ID, product ID and price for up to five COMPLETED transactions dated on 2025-03-10, ordered by price ascending with unknowns last, then transaction ID ascending.',
		query: 'SELECT t_id, prod_id, price FROM transactions WHERE status = \'COMPLETED\' AND date_time >= \'2025-03-10\' AND date_time < DATE(\'2025-03-10\', \'+1 day\') ORDER BY price ASC NULLS LAST, t_id ASC LIMIT 5',
		evidence: 'The report concerns the day of questioned transaction 25031001; timestamps include hours, so include the whole day.',
		payoff: 'This shortlist shows the stored results in the requested window. A selected day is not evidence that the whole business is failing.',
	},
	{
		problem: 'Retrieve transaction ID, product ID and price for up to five COMPLETED transactions dated on 2025-03-12, ordered by price ascending with unknowns last, then transaction ID ascending.',
		query: 'SELECT t_id, prod_id, price FROM transactions WHERE status = \'COMPLETED\' AND date_time >= \'2025-03-12\' AND date_time < DATE(\'2025-03-12\', \'+1 day\') ORDER BY price ASC NULLS LAST, t_id ASC LIMIT 5',
		evidence: 'The report concerns the day of questioned transaction 25031204; timestamps include hours, so include the whole day.',
		payoff: 'This shortlist shows the stored results in the requested window. A selected day is not evidence that the whole business is failing.',
	},
	{
		problem: 'Retrieve transaction ID, product ID and price for up to five COMPLETED transactions dated on 2025-04-11, ordered by price ascending with unknowns last, then transaction ID ascending.',
		query: 'SELECT t_id, prod_id, price FROM transactions WHERE status = \'COMPLETED\' AND date_time >= \'2025-04-11\' AND date_time < DATE(\'2025-04-11\', \'+1 day\') ORDER BY price ASC NULLS LAST, t_id ASC LIMIT 5',
		evidence: 'The report concerns the day of questioned transaction 25041119; timestamps include hours, so include the whole day.',
		payoff: 'This shortlist shows the stored results in the requested window. A selected day is not evidence that the whole business is failing.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-single-table-query-sale-shortlists',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
		comparisonOptions: {requireEqualRowOrder:true},
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Inspect a concise, reproducible deal shortlist.</Par>
			<Par>Goal: Combine a reporting window, status, ordering and a limit.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Combine a reporting window, status, ordering and a limit.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Use a half-open timestamp interval to include the whole day, then order before limiting.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
