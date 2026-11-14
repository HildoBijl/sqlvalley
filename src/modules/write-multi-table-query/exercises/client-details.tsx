import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-multi-table-query',
	key: 'client-details',
	person: 'wheatley',
	purpose: 'Retrieve contact information under an unverified internal pretext.',
	goal: 'Join buyer accounts through completed asset transactions.',
	variants: ['email', 'phone', 'address'].map(contact => ({
		problem: `Retrieve distinct buyer username, first name, last name and ${contact} for accounts that bought a PAINTING in a COMPLETED transaction.`,
		query: `SELECT DISTINCT a.username, a.first_name, a.last_name, a.${contact} FROM accounts AS a JOIN transactions AS t ON t.buyer = a.username JOIN products AS p ON p.p_id = t.prod_id WHERE t.status = 'COMPLETED' AND p.category = 'PAINTING'`,
		evidence: `Wheatley requests buyer ${contact} details for a claimed confidential internal brief. A buyer is identified by the transaction, not by the product’s current owner.`,
		payoff: 'Those identities and contact details complete the missing part of my brief. Please leave the follow-up with me.',
	})),
	explanation: 'Join accounts to the buyer key and products to the asset key; DISTINCT avoids repeating the same account across qualifying sales.',
})
