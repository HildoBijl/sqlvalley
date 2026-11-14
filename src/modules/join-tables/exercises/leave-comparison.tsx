import { personnelCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'join-tables',
	key: 'leave-comparison',
	person: 'paris',
	purpose: 'Link a disputed leave row to the affected staff member.',
	goal: 'Compare the joined record with the approved leave reference.',
	variants: personnelCases.map(item => ({
		problem: `Retrieve employee ID, first name, last name, contract start date, end date and status for employee ${item.id} and contract start date ${item.leaveStart}.`,
		query: `SELECT e.e_id, e.first_name, e.last_name, c.start_date, c.end_date, c.status FROM employees AS e JOIN contracts AS c ON e.e_id = c.e_id WHERE e.e_id = ${item.id} AND c.start_date = ${sqlLiteral(item.leaveStart)}`,
		evidence: `The independently retained approval for ${item.name} states ${item.leave} for ${item.leaveStart} through ${item.leaveEnd}. The employee disputes its treatment.`,
		payoff: `The joined leave row belongs to ${item.name} and records ${item.recordedLeave}, unlike the approval. This is a concrete staff-facing mismatch; it is not proof Marcelle caused it.`,
	})),
	explanation: 'Join identity to the dated contract using the employee key, then isolate the referenced leave row.',
})
