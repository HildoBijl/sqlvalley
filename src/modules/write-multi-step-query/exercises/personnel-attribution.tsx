import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For employees 72738553, 47132966, find the authenticated actor who changed every directory salary away from the current ACTIVE, open-ended contract salary and also changed each employee’s city to its current value. Match the salary event’s old value to the contract and new value to the directory. City edits must have different old and new values. Return the responsible employee’s ID, first name and last name.',
		query: 'WITH discrepancies AS (\n		SELECT DISTINCT e.e_id, e.current_salary, e.city, c.salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id\n		WHERE e.e_id IN (72738553, 47132966) AND c.status = \'ACTIVE\' AND c.end_date IS NULL AND e.current_salary <> c.salary\n	), corroborated_edits AS (\n		SELECT DISTINCT r.actor_e_id, d.e_id FROM discrepancies AS d JOIN record_changes AS r\n		ON r.table_name = \'employees\' AND r.row_key = CAST(d.e_id AS TEXT) AND r.field_name = \'current_salary\'\n		AND r.change_kind = \'UPDATE\' AND CAST(r.old_value AS REAL) = d.salary AND CAST(r.new_value AS REAL) = d.current_salary\n		WHERE EXISTS (SELECT 1 FROM record_changes AS city WHERE city.actor_e_id = r.actor_e_id\n		AND city.table_name = \'employees\' AND city.row_key = CAST(d.e_id AS TEXT) AND city.field_name = \'city\'\n		AND city.change_kind = \'UPDATE\' AND city.new_value = d.city AND city.old_value <> city.new_value)\n	), repeated_actor AS (\n		SELECT actor_e_id FROM corroborated_edits GROUP BY actor_e_id HAVING COUNT(DISTINCT e_id) = 2\n	)\n	SELECT e.e_id, e.first_name, e.last_name FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id',
		evidence: 'Use the independent authenticated change log, not the staff requestor or reporter. Signed agreements and verified travel claims corroborate the original personnel details. The current log export covers the investigated changes, including legitimate unrelated activity.',
		payoff: 'The linked and repeated changes identify Paris Morgan. The salary and city edits were made under her authenticated account, while Marcelle’s unrelated activity fails these conditions. In the confrontation Paris admits she caused downstream staff complaints to make Marcelle’s systems work look incompetent.',
	},
	{
		problem: 'For employees 72738553, 69733054, find the authenticated actor who changed every directory salary away from the current ACTIVE, open-ended contract salary and also changed each employee’s city to its current value. Match the salary event’s old value to the contract and new value to the directory. City edits must have different old and new values. Return the responsible employee’s ID, first name and last name.',
		query: 'WITH discrepancies AS (\n		SELECT DISTINCT e.e_id, e.current_salary, e.city, c.salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id\n		WHERE e.e_id IN (72738553, 69733054) AND c.status = \'ACTIVE\' AND c.end_date IS NULL AND e.current_salary <> c.salary\n	), corroborated_edits AS (\n		SELECT DISTINCT r.actor_e_id, d.e_id FROM discrepancies AS d JOIN record_changes AS r\n		ON r.table_name = \'employees\' AND r.row_key = CAST(d.e_id AS TEXT) AND r.field_name = \'current_salary\'\n		AND r.change_kind = \'UPDATE\' AND CAST(r.old_value AS REAL) = d.salary AND CAST(r.new_value AS REAL) = d.current_salary\n		WHERE EXISTS (SELECT 1 FROM record_changes AS city WHERE city.actor_e_id = r.actor_e_id\n		AND city.table_name = \'employees\' AND city.row_key = CAST(d.e_id AS TEXT) AND city.field_name = \'city\'\n		AND city.change_kind = \'UPDATE\' AND city.new_value = d.city AND city.old_value <> city.new_value)\n	), repeated_actor AS (\n		SELECT actor_e_id FROM corroborated_edits GROUP BY actor_e_id HAVING COUNT(DISTINCT e_id) = 2\n	)\n	SELECT e.e_id, e.first_name, e.last_name FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id',
		evidence: 'Use the independent authenticated change log, not the staff requestor or reporter. Signed agreements and verified travel claims corroborate the original personnel details. The current log export covers the investigated changes, including legitimate unrelated activity.',
		payoff: 'The linked and repeated changes identify Paris Morgan. The salary and city edits were made under her authenticated account, while Marcelle’s unrelated activity fails these conditions. In the confrontation Paris admits she caused downstream staff complaints to make Marcelle’s systems work look incompetent.',
	},
	{
		problem: 'For employees 72738553, 47132966, 69733054, find the authenticated actor who changed every directory salary away from the current ACTIVE, open-ended contract salary and also changed each employee’s city to its current value. Match the salary event’s old value to the contract and new value to the directory. City edits must have different old and new values. Return the responsible employee’s ID, first name and last name.',
		query: 'WITH discrepancies AS (\n		SELECT DISTINCT e.e_id, e.current_salary, e.city, c.salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id\n		WHERE e.e_id IN (72738553, 47132966, 69733054) AND c.status = \'ACTIVE\' AND c.end_date IS NULL AND e.current_salary <> c.salary\n	), corroborated_edits AS (\n		SELECT DISTINCT r.actor_e_id, d.e_id FROM discrepancies AS d JOIN record_changes AS r\n		ON r.table_name = \'employees\' AND r.row_key = CAST(d.e_id AS TEXT) AND r.field_name = \'current_salary\'\n		AND r.change_kind = \'UPDATE\' AND CAST(r.old_value AS REAL) = d.salary AND CAST(r.new_value AS REAL) = d.current_salary\n		WHERE EXISTS (SELECT 1 FROM record_changes AS city WHERE city.actor_e_id = r.actor_e_id\n		AND city.table_name = \'employees\' AND city.row_key = CAST(d.e_id AS TEXT) AND city.field_name = \'city\'\n		AND city.change_kind = \'UPDATE\' AND city.new_value = d.city AND city.old_value <> city.new_value)\n	), repeated_actor AS (\n		SELECT actor_e_id FROM corroborated_edits GROUP BY actor_e_id HAVING COUNT(DISTINCT e_id) = 3\n	)\n	SELECT e.e_id, e.first_name, e.last_name FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id',
		evidence: 'Use the independent authenticated change log, not the staff requestor or reporter. Signed agreements and verified travel claims corroborate the original personnel details. The current log export covers the investigated changes, including legitimate unrelated activity.',
		payoff: 'The linked and repeated changes identify Paris Morgan. The salary and city edits were made under her authenticated account, while Marcelle’s unrelated activity fails these conditions. In the confrontation Paris admits she caused downstream staff complaints to make Marcelle’s systems work look incompetent.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-multi-step-query-personnel-attribution',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Attribute the staff-facing record changes.</Par>
			<Par>Goal: Require a repeated salary discrepancy and separate location corroboration.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Require a repeated salary discrepancy and separate location corroboration.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Build the active-contract discrepancies, link before and after salary values, require a separate city event by the same actor, then aggregate across every selected employee before resolving the identity.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
