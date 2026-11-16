import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Retrieve distinct buyer username, first name, last name and email for accounts that bought a PAINTING in a COMPLETED transaction.',
		query: 'SELECT DISTINCT a.username, a.first_name, a.last_name, a.email FROM accounts AS a JOIN transactions AS t ON t.buyer = a.username JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = \'COMPLETED\' AND p.category = \'PAINTING\'',
		evidence: 'Wheatley requests buyer email details for a claimed confidential internal brief. A buyer is identified by the transaction, not by the product’s current owner.',
		payoff: 'Those identities and contact details complete the missing part of my brief. Please leave the follow-up with me.',
	},
	{
		problem: 'Retrieve distinct buyer username, first name, last name and phone for accounts that bought a PAINTING in a COMPLETED transaction.',
		query: 'SELECT DISTINCT a.username, a.first_name, a.last_name, a.phone FROM accounts AS a JOIN transactions AS t ON t.buyer = a.username JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = \'COMPLETED\' AND p.category = \'PAINTING\'',
		evidence: 'Wheatley requests buyer phone details for a claimed confidential internal brief. A buyer is identified by the transaction, not by the product’s current owner.',
		payoff: 'Those identities and contact details complete the missing part of my brief. Please leave the follow-up with me.',
	},
	{
		problem: 'Retrieve distinct buyer username, first name, last name and address for accounts that bought a PAINTING in a COMPLETED transaction.',
		query: 'SELECT DISTINCT a.username, a.first_name, a.last_name, a.address FROM accounts AS a JOIN transactions AS t ON t.buyer = a.username JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = \'COMPLETED\' AND p.category = \'PAINTING\'',
		evidence: 'Wheatley requests buyer address details for a claimed confidential internal brief. A buyer is identified by the transaction, not by the product’s current owner.',
		payoff: 'Those identities and contact details complete the missing part of my brief. Please leave the follow-up with me.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-multi-table-query-client-details',
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
			<Par>Purpose: Retrieve contact information under an unverified internal pretext.</Par>
			<Par>Goal: Join buyer accounts through completed asset transactions.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Join buyer accounts through completed asset transactions.</Par>
			<SpeechBox person="wheatley"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Join accounts to the buyer key and products to the asset key; DISTINCT avoids repeating the same account across qualifying sales.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
