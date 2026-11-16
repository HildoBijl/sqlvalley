import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'Identify the authenticated employee who lowered prices on all 2 selected COMPLETED sales (25031001, 25031204) to below half their assets’ current estimates, and also lowered at least one 2025 Q1 category’s revenue from above its operating expenses to below them. Match each change’s table, row key, field and new value to the current record; require a downward old-to-new change. Return employee ID, first name and last name.',
		query: 'WITH weak_sales AS (\n		SELECT t.t_id, t.price FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id\n		WHERE t.t_id IN (25031001, 25031204) AND t.status = \'COMPLETED\' AND t.price < p.est_value * 0.5\n	), sale_actors AS (\n		SELECT r.actor_e_id FROM weak_sales AS s JOIN record_changes AS r\n		ON r.table_name = \'transactions\' AND r.row_key = CAST(s.t_id AS TEXT) AND r.field_name = \'price\'\n		AND r.change_kind = \'UPDATE\' AND CAST(r.new_value AS REAL) = s.price AND CAST(r.old_value AS REAL) > s.price\n		GROUP BY r.actor_e_id HAVING COUNT(DISTINCT s.t_id) = 2\n	), reversed_categories AS (\n		SELECT DISTINCT r.actor_e_id FROM quarterly_performance AS q JOIN record_changes AS r\n		ON r.table_name = \'quarterly_performance\' AND r.row_key = CAST(q.fiscal_year AS TEXT) || \'|\' || q.quarter || \'|\' || q.category\n		AND r.field_name = \'revenue\' AND r.change_kind = \'UPDATE\' AND CAST(r.new_value AS REAL) = q.revenue\n		WHERE q.fiscal_year = 2025 AND q.quarter = \'Q1\' AND q.revenue < q.operating_expenses AND CAST(r.old_value AS REAL) > q.operating_expenses\n	)\n	SELECT e.e_id, e.first_name, e.last_name FROM employees AS e JOIN sale_actors AS s ON s.actor_e_id = e.e_id JOIN reversed_categories AS q ON q.actor_e_id = e.e_id',
		evidence: 'Marcelle supplies the independent signed change-log export. actor_e_id identifies the authenticated individual account; row keys are transaction IDs or fiscal_year|quarter|category. Routine changes are also present. The independent close statements corroborate the original quarterly figures.',
		payoff: 'The complete chain identifies Bob Andrews: the same authenticated actor lowered the selected deal records and reversed the quarterly report’s apparent result. In the confrontation Bob admits he wanted the exclusive pivot to look like a failure so the company would return to its public-access mission. The query establishes the edits; his admission establishes the motive.',
	},
	{
		problem: 'Identify the authenticated employee who lowered prices on all 2 selected COMPLETED sales (25031001, 25041119) to below half their assets’ current estimates, and also lowered at least one 2025 Q1 category’s revenue from above its operating expenses to below them. Match each change’s table, row key, field and new value to the current record; require a downward old-to-new change. Return employee ID, first name and last name.',
		query: 'WITH weak_sales AS (\n		SELECT t.t_id, t.price FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id\n		WHERE t.t_id IN (25031001, 25041119) AND t.status = \'COMPLETED\' AND t.price < p.est_value * 0.5\n	), sale_actors AS (\n		SELECT r.actor_e_id FROM weak_sales AS s JOIN record_changes AS r\n		ON r.table_name = \'transactions\' AND r.row_key = CAST(s.t_id AS TEXT) AND r.field_name = \'price\'\n		AND r.change_kind = \'UPDATE\' AND CAST(r.new_value AS REAL) = s.price AND CAST(r.old_value AS REAL) > s.price\n		GROUP BY r.actor_e_id HAVING COUNT(DISTINCT s.t_id) = 2\n	), reversed_categories AS (\n		SELECT DISTINCT r.actor_e_id FROM quarterly_performance AS q JOIN record_changes AS r\n		ON r.table_name = \'quarterly_performance\' AND r.row_key = CAST(q.fiscal_year AS TEXT) || \'|\' || q.quarter || \'|\' || q.category\n		AND r.field_name = \'revenue\' AND r.change_kind = \'UPDATE\' AND CAST(r.new_value AS REAL) = q.revenue\n		WHERE q.fiscal_year = 2025 AND q.quarter = \'Q1\' AND q.revenue < q.operating_expenses AND CAST(r.old_value AS REAL) > q.operating_expenses\n	)\n	SELECT e.e_id, e.first_name, e.last_name FROM employees AS e JOIN sale_actors AS s ON s.actor_e_id = e.e_id JOIN reversed_categories AS q ON q.actor_e_id = e.e_id',
		evidence: 'Marcelle supplies the independent signed change-log export. actor_e_id identifies the authenticated individual account; row keys are transaction IDs or fiscal_year|quarter|category. Routine changes are also present. The independent close statements corroborate the original quarterly figures.',
		payoff: 'The complete chain identifies Bob Andrews: the same authenticated actor lowered the selected deal records and reversed the quarterly report’s apparent result. In the confrontation Bob admits he wanted the exclusive pivot to look like a failure so the company would return to its public-access mission. The query establishes the edits; his admission establishes the motive.',
	},
	{
		problem: 'Identify the authenticated employee who lowered prices on all 3 selected COMPLETED sales (25031001, 25031204, 25041119) to below half their assets’ current estimates, and also lowered at least one 2025 Q1 category’s revenue from above its operating expenses to below them. Match each change’s table, row key, field and new value to the current record; require a downward old-to-new change. Return employee ID, first name and last name.',
		query: 'WITH weak_sales AS (\n		SELECT t.t_id, t.price FROM transactions AS t JOIN products AS p ON p.p_id = t.prod_id\n		WHERE t.t_id IN (25031001, 25031204, 25041119) AND t.status = \'COMPLETED\' AND t.price < p.est_value * 0.5\n	), sale_actors AS (\n		SELECT r.actor_e_id FROM weak_sales AS s JOIN record_changes AS r\n		ON r.table_name = \'transactions\' AND r.row_key = CAST(s.t_id AS TEXT) AND r.field_name = \'price\'\n		AND r.change_kind = \'UPDATE\' AND CAST(r.new_value AS REAL) = s.price AND CAST(r.old_value AS REAL) > s.price\n		GROUP BY r.actor_e_id HAVING COUNT(DISTINCT s.t_id) = 3\n	), reversed_categories AS (\n		SELECT DISTINCT r.actor_e_id FROM quarterly_performance AS q JOIN record_changes AS r\n		ON r.table_name = \'quarterly_performance\' AND r.row_key = CAST(q.fiscal_year AS TEXT) || \'|\' || q.quarter || \'|\' || q.category\n		AND r.field_name = \'revenue\' AND r.change_kind = \'UPDATE\' AND CAST(r.new_value AS REAL) = q.revenue\n		WHERE q.fiscal_year = 2025 AND q.quarter = \'Q1\' AND q.revenue < q.operating_expenses AND CAST(r.old_value AS REAL) > q.operating_expenses\n	)\n	SELECT e.e_id, e.first_name, e.last_name FROM employees AS e JOIN sale_actors AS s ON s.actor_e_id = e.e_id JOIN reversed_categories AS q ON q.actor_e_id = e.e_id',
		evidence: 'Marcelle supplies the independent signed change-log export. actor_e_id identifies the authenticated individual account; row keys are transaction IDs or fiscal_year|quarter|category. Routine changes are also present. The independent close statements corroborate the original quarterly figures.',
		payoff: 'The complete chain identifies Bob Andrews: the same authenticated actor lowered the selected deal records and reversed the quarterly report’s apparent result. In the confrontation Bob admits he wanted the exclusive pivot to look like a failure so the company would return to its public-access mission. The query establishes the edits; his admission establishes the motive.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-multi-step-query-commercial-attribution',
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
			<Par>Purpose: Attribute the commercial manipulation using multiple independent links.</Par>
			<Par>Goal: Identify an actor only after corroborating current deals and quarterly records.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Identify an actor only after corroborating current deals and quarterly records.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>First isolate the selected weak deals, then aggregate matching downward edits by actor. Independently find revenue changes that reverse a category’s apparent result, and intersect the actors before returning identities.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
