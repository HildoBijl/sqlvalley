import { personnelCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'choose-columns',
	key: 'leave-fields',
	person: 'paris',
	purpose: 'Prepare a leave handoff with clear field names.',
	goal: 'Compare a stored status with an independently approved leave request.',
	variants: personnelCases.map(item => ({
		problem: 'Retrieve employee ID, start date, end date and status from every contract. Rename status to leave_category.',
		query: 'SELECT e_id, start_date, end_date, status AS leave_category FROM contracts',
		evidence: `The approved leave for ${item.name}, employee ${item.id}, starting ${item.leaveStart}, was ${item.leave}. Staff say it has been treated differently.`,
		payoff: `The leave row records ${item.recordedLeave}, unlike the approval’s ${item.leave}. We have a specific discrepancy to follow up.`,
	})),
	explanation: 'AS changes the output heading; it does not change stored data.',
	comparisonOptions: { requireEqualColumnNames: true },
})
