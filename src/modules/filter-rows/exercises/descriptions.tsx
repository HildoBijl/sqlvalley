import { expenseCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'filter-rows',
	key: 'descriptions',
	person: 'caesar',
	purpose: 'Find a request that staff cannot reconcile.',
	goal: 'Use description patterns or unknown approvals as leads.',
	variants: [
		...expenseCases.map(item => ({
			problem: `Retrieve all expenses whose description contains ${item.description.split(' - ')[1]}.`,
			query: `SELECT * FROM expenses WHERE description LIKE ${sqlLiteral('%' + item.description.split(' - ')[1] + '%')}`,
			evidence: `The department retained one supplier invoice for ${item.description}, but its spending report is difficult to reconcile.`,
			payoff: 'The matching request rows let us compare dates, amounts and approval fields. Repeated descriptions need checking; they do not prove money moved.',
		})),
		{ problem: 'Retrieve all expenses whose approver is unknown.', query: 'SELECT * FROM expenses WHERE approved_by IS NULL', evidence: 'Staff following up a purchase cannot find its expected approval. An unknown approval is a review lead rather than proof of misconduct.', payoff: 'These are the entries with an unknown approver, including the disputed request. We still need the source authorization.' },
	],
	explanation: 'LIKE can match a reference inside text. IS NULL tests an unknown value; equality to NULL does not.',
})
