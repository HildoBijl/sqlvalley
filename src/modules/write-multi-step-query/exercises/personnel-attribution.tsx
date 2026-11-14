import { personnelCases, caseGroups } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-multi-step-query',
	key: 'personnel-attribution',
	person: 'caesar',
	purpose: 'Attribute the staff-facing record changes.',
	goal: 'Require a repeated salary discrepancy and separate location corroboration.',
	variants: caseGroups.map(group => {
		const ids = group.map(index => personnelCases[index].id).join(', ')
		return {
			problem: `For employees ${ids}, find the authenticated actor who changed every directory salary away from the current ACTIVE, open-ended contract salary and also changed each employee’s city to its current value. Match the salary event’s old value to the contract and new value to the directory. City edits must have different old and new values. Return the responsible employee’s ID, first name and last name.`,
			query: `WITH discrepancies AS (
		SELECT DISTINCT e.e_id, e.current_salary, e.city, c.salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id
		WHERE e.e_id IN (${ids}) AND c.status = 'ACTIVE' AND c.end_date IS NULL AND e.current_salary <> c.salary
	), corroborated_edits AS (
		SELECT DISTINCT r.actor_e_id, d.e_id FROM discrepancies AS d JOIN record_changes AS r
		ON r.table_name = 'employees' AND r.row_key = CAST(d.e_id AS TEXT) AND r.field_name = 'current_salary'
		AND r.change_kind = 'UPDATE' AND CAST(r.old_value AS REAL) = d.salary AND CAST(r.new_value AS REAL) = d.current_salary
		WHERE EXISTS (SELECT 1 FROM record_changes AS city WHERE city.actor_e_id = r.actor_e_id
		AND city.table_name = 'employees' AND city.row_key = CAST(d.e_id AS TEXT) AND city.field_name = 'city'
		AND city.change_kind = 'UPDATE' AND city.new_value = d.city AND city.old_value <> city.new_value)
	), repeated_actor AS (
		SELECT actor_e_id FROM corroborated_edits GROUP BY actor_e_id HAVING COUNT(DISTINCT e_id) = ${group.length}
	)
	SELECT e.e_id, e.first_name, e.last_name FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id`,
			evidence: 'Use the independent authenticated change log, not the staff requestor or reporter. Signed agreements and verified travel claims corroborate the original personnel details. The current log export covers the investigated changes, including legitimate unrelated activity.',
			payoff: 'The linked and repeated changes identify Paris Morgan. The salary and city edits were made under her authenticated account, while Marcelle’s unrelated activity fails these conditions. In the confrontation Paris admits she caused downstream staff complaints to make Marcelle’s systems work look incompetent.',
		}
	}),
	explanation: 'Build the active-contract discrepancies, link before and after salary values, require a separate city event by the same actor, then aggregate across every selected employee before resolving the identity.',
})
