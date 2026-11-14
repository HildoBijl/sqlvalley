import { expenseCases, caseGroups, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-multi-step-query',
	key: 'expense-attribution',
	person: 'caesar',
	purpose: 'Attribute repeated duplicate service requests.',
	goal: 'Separate the insertion actor from requesters, approvers and payment evidence.',
	variants: caseGroups.map(group => {
		const selected = group.map(index => expenseCases[index])
		const descriptions = selected.map(item => sqlLiteral(item.description)).join(', ')
		return {
			problem: `For service references ${selected.map(item => item.description).join('; ')}, identify the authenticated actor who inserted a later request duplicating an earlier request’s description, department and amount for every selected reference. Require at least two matching requests per reference and match INSERT events to the later row’s key and description. Return employee ID, first name, last name and the sum of the later request amounts as duplicated_amount.`,
			query: `WITH repeated_services AS (
		SELECT description, d_id, amount FROM expenses WHERE description IN (${descriptions})
		GROUP BY description, d_id, amount HAVING COUNT(*) >= 2
	), later_requests AS (
		SELECT x.* FROM expenses AS x JOIN repeated_services AS s ON s.description = x.description AND s.d_id = x.d_id AND s.amount = x.amount
		WHERE EXISTS (SELECT 1 FROM expenses AS original WHERE original.description = x.description AND original.d_id = x.d_id AND original.amount = x.amount AND original.date < x.date)
	), attributed_requests AS (
		SELECT DISTINCT r.actor_e_id, x.exp_id, x.description, x.amount FROM later_requests AS x JOIN record_changes AS r
		ON r.table_name = 'expenses' AND r.row_key = CAST(x.exp_id AS TEXT) AND r.field_name = 'description'
		AND r.change_kind = 'INSERT' AND r.new_value = x.description AND r.old_value IS NULL
	), repeated_actor AS (
		SELECT actor_e_id, SUM(amount) AS duplicated_amount FROM attributed_requests GROUP BY actor_e_id HAVING COUNT(DISTINCT description) = ${selected.length}
	)
	SELECT e.e_id, e.first_name, e.last_name, a.duplicated_amount FROM employees AS e JOIN repeated_actor AS a ON a.actor_e_id = e.e_id`,
			evidence: 'Departments retained one supplier invoice per selected reference. The independent signed log attributes record creation to an authenticated actor. The expenses table records requests, so this query alone cannot prove a transfer or identify a payment destination.',
			payoff: 'The repeated insertion pattern identifies Elvis, rather than the ordinary staff named as requesters. Separately, Marcelle presents bank settlement confirmations: the duplicate requests were paid to a supplier account controlled by Elvis. Confronted with the combined evidence, Elvis admits siphoning funds because he believed the company was failing. The SQL proves the duplicated requests and their insertion actor; the independent confirmations and admission establish diversion and motive.',
		}
	}),
	explanation: 'Group matching service requests, isolate later duplicates, join authenticated insertion events, then aggregate by actor across all selected references before resolving identity and total.',
	comparisonOptions: { requireEqualColumnNames: true },
})
