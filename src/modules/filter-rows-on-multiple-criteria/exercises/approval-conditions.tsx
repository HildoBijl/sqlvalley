import { expenseCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'filter-rows-on-multiple-criteria',
	key: 'approval-conditions',
	person: 'caesar',
	purpose: 'Inspect exceptional authorization fields.',
	goal: 'Combine grouped alternatives, negation and NULL tests.',
	variants: expenseCases.map(item => ({
		problem: `Retrieve all expenses for department ${item.department} whose approver is either unknown or different from employee ${item.approver}.`,
		query: `SELECT * FROM expenses WHERE d_id = ${item.department} AND (approved_by IS NULL OR NOT (approved_by = ${item.approver}))`,
		evidence: `The department expected employee ${item.approver} to approve ${item.description}. A listed approver does not identify the person who entered the request.`,
		payoff: 'The later disputed request has an unexpected or absent approval. This is a control discrepancy worth investigating, not proof of who created the row.',
	})),
	explanation: 'Parenthesize the alternatives so the department condition applies to both. Include IS NULL because ordinary comparisons do not match unknown values.',
})
