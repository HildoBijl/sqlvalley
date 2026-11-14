import { expenseCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-lookup-query',
	key: 'approvers',
	person: 'caesar',
	purpose: 'Look up a specific request’s listed authorization.',
	goal: 'Use a uniquely identified scalar lookup.',
	variants: expenseCases.map(item => ({
		problem: `Retrieve employee ID, first name and last name for the employee listed as approver on expense ${item.originalId}.`,
		query: `SELECT e_id, first_name, last_name FROM employees WHERE e_id = (SELECT approved_by FROM expenses WHERE exp_id = ${item.originalId})`,
		evidence: `Expense ${item.originalId} is the earlier request for ${item.description}. The department wants to compare its expected authorization with the later request.`,
		payoff: 'The earlier entry names the expected approver. The later entry’s different or missing authorization remains unexplained; neither field records the data-entry actor.',
	})),
	explanation: 'The expense primary key guarantees at most one value for the scalar subquery.',
})
