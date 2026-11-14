import { expenseCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'filter-rows-on-multiple-criteria',
	key: 'expense-periods',
	person: 'caesar',
	purpose: 'Narrow the disputed departmental requests.',
	goal: 'Combine department and date conditions.',
	variants: expenseCases.map(item => ({
		problem: `Retrieve all expenses for department ${item.department} dated from ${item.firstDate} through ${item.secondDate}, inclusive.`,
		query: `SELECT * FROM expenses WHERE d_id = ${item.department} AND date >= ${sqlLiteral(item.firstDate)} AND date <= ${sqlLiteral(item.secondDate)}`,
		evidence: `The department retained one invoice for ${item.description}. These dates bracket the disputed reporting period.`,
		payoff: 'Both same-reference requests appear in the selected period. That is a reconciliation problem; these rows alone do not prove that either request was paid.',
	})),
	explanation: 'Combine the department with both inclusive date boundaries using AND.',
})
