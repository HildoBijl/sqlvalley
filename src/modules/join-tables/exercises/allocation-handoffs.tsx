import { personnelCases, caseGroups } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'join-tables',
	key: 'allocation-handoffs',
	person: 'paris',
	purpose: 'Inspect departmental handoffs for affected staff.',
	goal: 'Preserve staff who have no allocation through an outer join.',
	variants: caseGroups.map(group => {
		const people = group.map(index => personnelCases[index])
		const ids = people.map(item => item.id).join(', ')
		return {
			problem: `For employees ${ids}, retrieve employee ID, first name, last name, department ID and department name as department_name. Include each employee even if no department allocation exists.`,
			query: `SELECT e.e_id, e.first_name, e.last_name, d.d_id, d.d_name AS department_name FROM employees AS e LEFT JOIN allocations AS a ON a.e_id = e.e_id LEFT JOIN departments AS d ON d.d_id = a.d_id WHERE e.e_id IN (${ids})`,
			evidence: 'Staff say their approval handoffs are not reaching the expected teams. The current allocation table has no dates and can contain several memberships per person.',
			payoff: 'Noah’s directory row survives with no department match. That explains a missing routing reference. The current table cannot prove when an allocation disappeared or who removed it.',
		}
	}),
	explanation: 'Use LEFT JOIN at both relationship steps. Filtering out null departments would hide the missing handoff.',
	comparisonOptions: { requireEqualColumnNames: true },
})
