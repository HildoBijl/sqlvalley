import { expenseCases, money } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'filter-rows',
	key: 'department-expenses',
	person: 'caesar',
	purpose: 'Locate expenses behind a departmental complaint.',
	goal: 'Inspect recorded requests without claiming they were paid.',
	variants: expenseCases.map(item => ({
		problem: `Retrieve all expenses charged to department ${item.department}.`,
		query: `SELECT * FROM expenses WHERE d_id = ${item.department}`,
		evidence: `Department ${item.department} cannot reconcile its budget usage. Its signed supplier paperwork lists one ${money(item.amount)} charge for ${item.description}.`,
		payoff: `The list includes repeated entries for ${item.description}. We should reconcile those requests with the supplier paperwork; a request is not a payment.`,
	})),
	explanation: 'Use one equality condition to retain the department’s expense rows.',
})
