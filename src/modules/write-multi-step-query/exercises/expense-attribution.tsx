import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For service references Database support - invoice LS-184; Provenance services - invoice LS-227, identify the authenticated actor who inserted a later request duplicating an earlier request’s description, department and amount for every selected reference. Require at least two matching requests per reference and match INSERT events to the later row’s key and description. Return employee ID, first name, last name and the sum of the later request amounts as duplicated_amount.',
		query: 'WITH repeated_services AS (\n		SELECT description, d_id, amount FROM expenses WHERE description IN (\'Database support - invoice LS-184\', \'Provenance services - invoice LS-227\')\n		GROUP BY description, d_id, amount HAVING COUNT(*) >= 2\n	), later_requests AS (\n		SELECT x.* FROM expenses AS x JOIN repeated_services AS s ON s.description = x.description AND s.d_id = x.d_id AND s.amount = x.amount\n		WHERE EXISTS (SELECT 1 FROM expenses AS original WHERE original.description = x.description AND original.d_id = x.d_id AND original.amount = x.amount AND original.date < x.date)\n	), attributed_requests AS (\n		SELECT DISTINCT r.actor_e_id, x.exp_id, x.description, x.amount FROM later_requests AS x JOIN record_changes AS r\n		ON r.table_name = \'expenses\' AND r.row_key = CAST(x.exp_id AS TEXT) AND r.field_name = \'description\'\n		AND r.change_kind = \'INSERT\' AND r.new_value = x.description AND r.old_value IS NULL\n	), repeated_actor AS (\n		SELECT actor_e_id, SUM(amount) AS duplicated_amount FROM attributed_requests GROUP BY actor_e_id HAVING COUNT(DISTINCT description) = 2\n	)\n	SELECT e.e_id, e.first_name, e.last_name, a.duplicated_amount FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id',
		evidence: 'Departments retained one supplier invoice per selected reference. The independent signed log attributes record creation to an authenticated actor. The expenses table records requests, so this query alone cannot prove a transfer or identify a payment destination.',
		payoff: 'The repeated insertion pattern identifies Elvis, rather than the ordinary staff named as requesters. Separately, Marcelle presents bank settlement confirmations: the duplicate requests were paid to a supplier account controlled by Elvis. Confronted with the combined evidence, Elvis admits siphoning funds because he believed the company was failing. The SQL proves the duplicated requests and their insertion actor; the independent confirmations and admission establish diversion and motive.',
	},
	{
		problem: 'For service references Database support - invoice LS-184; Platform support - invoice LS-316, identify the authenticated actor who inserted a later request duplicating an earlier request’s description, department and amount for every selected reference. Require at least two matching requests per reference and match INSERT events to the later row’s key and description. Return employee ID, first name, last name and the sum of the later request amounts as duplicated_amount.',
		query: 'WITH repeated_services AS (\n		SELECT description, d_id, amount FROM expenses WHERE description IN (\'Database support - invoice LS-184\', \'Platform support - invoice LS-316\')\n		GROUP BY description, d_id, amount HAVING COUNT(*) >= 2\n	), later_requests AS (\n		SELECT x.* FROM expenses AS x JOIN repeated_services AS s ON s.description = x.description AND s.d_id = x.d_id AND s.amount = x.amount\n		WHERE EXISTS (SELECT 1 FROM expenses AS original WHERE original.description = x.description AND original.d_id = x.d_id AND original.amount = x.amount AND original.date < x.date)\n	), attributed_requests AS (\n		SELECT DISTINCT r.actor_e_id, x.exp_id, x.description, x.amount FROM later_requests AS x JOIN record_changes AS r\n		ON r.table_name = \'expenses\' AND r.row_key = CAST(x.exp_id AS TEXT) AND r.field_name = \'description\'\n		AND r.change_kind = \'INSERT\' AND r.new_value = x.description AND r.old_value IS NULL\n	), repeated_actor AS (\n		SELECT actor_e_id, SUM(amount) AS duplicated_amount FROM attributed_requests GROUP BY actor_e_id HAVING COUNT(DISTINCT description) = 2\n	)\n	SELECT e.e_id, e.first_name, e.last_name, a.duplicated_amount FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id',
		evidence: 'Departments retained one supplier invoice per selected reference. The independent signed log attributes record creation to an authenticated actor. The expenses table records requests, so this query alone cannot prove a transfer or identify a payment destination.',
		payoff: 'The repeated insertion pattern identifies Elvis, rather than the ordinary staff named as requesters. Separately, Marcelle presents bank settlement confirmations: the duplicate requests were paid to a supplier account controlled by Elvis. Confronted with the combined evidence, Elvis admits siphoning funds because he believed the company was failing. The SQL proves the duplicated requests and their insertion actor; the independent confirmations and admission establish diversion and motive.',
	},
	{
		problem: 'For service references Database support - invoice LS-184; Provenance services - invoice LS-227; Platform support - invoice LS-316, identify the authenticated actor who inserted a later request duplicating an earlier request’s description, department and amount for every selected reference. Require at least two matching requests per reference and match INSERT events to the later row’s key and description. Return employee ID, first name, last name and the sum of the later request amounts as duplicated_amount.',
		query: 'WITH repeated_services AS (\n		SELECT description, d_id, amount FROM expenses WHERE description IN (\'Database support - invoice LS-184\', \'Provenance services - invoice LS-227\', \'Platform support - invoice LS-316\')\n		GROUP BY description, d_id, amount HAVING COUNT(*) >= 2\n	), later_requests AS (\n		SELECT x.* FROM expenses AS x JOIN repeated_services AS s ON s.description = x.description AND s.d_id = x.d_id AND s.amount = x.amount\n		WHERE EXISTS (SELECT 1 FROM expenses AS original WHERE original.description = x.description AND original.d_id = x.d_id AND original.amount = x.amount AND original.date < x.date)\n	), attributed_requests AS (\n		SELECT DISTINCT r.actor_e_id, x.exp_id, x.description, x.amount FROM later_requests AS x JOIN record_changes AS r\n		ON r.table_name = \'expenses\' AND r.row_key = CAST(x.exp_id AS TEXT) AND r.field_name = \'description\'\n		AND r.change_kind = \'INSERT\' AND r.new_value = x.description AND r.old_value IS NULL\n	), repeated_actor AS (\n		SELECT actor_e_id, SUM(amount) AS duplicated_amount FROM attributed_requests GROUP BY actor_e_id HAVING COUNT(DISTINCT description) = 3\n	)\n	SELECT e.e_id, e.first_name, e.last_name, a.duplicated_amount FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id',
		evidence: 'Departments retained one supplier invoice per selected reference. The independent signed log attributes record creation to an authenticated actor. The expenses table records requests, so this query alone cannot prove a transfer or identify a payment destination.',
		payoff: 'The repeated insertion pattern identifies Elvis, rather than the ordinary staff named as requesters. Separately, Marcelle presents bank settlement confirmations: the duplicate requests were paid to a supplier account controlled by Elvis. Confronted with the combined evidence, Elvis admits siphoning funds because he believed the company was failing. The SQL proves the duplicated requests and their insertion actor; the independent confirmations and admission establish diversion and motive.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-write-multi-step-query-expense-attribution',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
		comparisonOptions: {requireEqualColumnNames:true},
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Attribute repeated duplicate service requests.</Par>
			<Par>Goal: Separate the insertion actor from requesters, approvers and payment evidence.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Separate the insertion actor from requesters, approvers and payment evidence.</Par>
			<SpeechBox person="caesar"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Group matching service requests, isolate later duplicates, join authenticated insertion events, then aggregate by actor across all selected references before resolving identity and total.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
