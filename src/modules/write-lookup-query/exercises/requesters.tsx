import { expenseCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-lookup-query',
	key: 'requesters',
	person: 'caesar',
	purpose: 'Identify the recorded requester of a disputed service.',
	goal: 'Use membership lookup without confusing responsibility with authorship.',
	variants: expenseCases.map(item => ({
		problem: `Retrieve employee ID, first name and last name for employees listed as requesters on expenses with description exactly ${item.description}.`,
		query: `SELECT e_id, first_name, last_name FROM employees WHERE e_id IN (SELECT requested_by FROM expenses WHERE description = ${sqlLiteral(item.description)})`,
		evidence: 'The department has one retained service invoice but multiple request records. The requester field is an operational reference, not an edit log.',
		payoff: 'The named employee says they requested the service once. Their identity gives us a witness to ask, not the identity of the person who inserted a second request.',
	})),
	explanation: 'IN checks membership in the requester IDs returned by the inner query.',
})
