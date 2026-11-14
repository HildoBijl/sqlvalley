import { personnelCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-single-criterion-query',
	key: 'leave-extract',
	person: 'paris',
	purpose: 'Inspect a disputed leave status.',
	goal: 'Compare the recorded category with an approved request.',
	variants: personnelCases.map(item => ({
		problem: `Retrieve employee ID, position, start date, end date and status for contracts whose status is ${item.recordedLeave}.`,
		query: `SELECT e_id, position, start_date, end_date, status FROM contracts WHERE status = ${sqlLiteral(item.recordedLeave)}`,
		evidence: `${item.name}, employee ${item.id}, supplied approval for ${item.leave} starting ${item.leaveStart}, but staff reported ${item.recordedLeave}.`,
		payoff: `The selected rows include that leave record classified as ${item.recordedLeave}. A legitimate overlapping employment row is not itself an error.`,
	})),
	explanation: 'Filter on one status value, retaining the date fields needed to locate the referenced leave.',
})
