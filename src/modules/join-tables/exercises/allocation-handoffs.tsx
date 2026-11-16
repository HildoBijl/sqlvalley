import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For employees 72738553, 47132966, retrieve employee ID, first name, last name, department ID and department name as department_name. Include each employee even if no department allocation exists.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, d.d_id, d.d_name AS department_name FROM employees AS e LEFT JOIN allocations AS a ON a.e_id = e.e_id LEFT JOIN departments AS d ON d.d_id = a.d_id WHERE e.e_id IN (72738553, 47132966)',
		evidence: 'Staff say their approval handoffs are not reaching the expected teams. The current allocation table has no dates and can contain several memberships per person.',
		payoff: 'Noah’s directory row survives with no department match. That explains a missing routing reference. The current table cannot prove when an allocation disappeared or who removed it.',
	},
	{
		problem: 'For employees 72738553, 69733054, retrieve employee ID, first name, last name, department ID and department name as department_name. Include each employee even if no department allocation exists.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, d.d_id, d.d_name AS department_name FROM employees AS e LEFT JOIN allocations AS a ON a.e_id = e.e_id LEFT JOIN departments AS d ON d.d_id = a.d_id WHERE e.e_id IN (72738553, 69733054)',
		evidence: 'Staff say their approval handoffs are not reaching the expected teams. The current allocation table has no dates and can contain several memberships per person.',
		payoff: 'Noah’s directory row survives with no department match. That explains a missing routing reference. The current table cannot prove when an allocation disappeared or who removed it.',
	},
	{
		problem: 'For employees 72738553, 47132966, 69733054, retrieve employee ID, first name, last name, department ID and department name as department_name. Include each employee even if no department allocation exists.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, d.d_id, d.d_name AS department_name FROM employees AS e LEFT JOIN allocations AS a ON a.e_id = e.e_id LEFT JOIN departments AS d ON d.d_id = a.d_id WHERE e.e_id IN (72738553, 47132966, 69733054)',
		evidence: 'Staff say their approval handoffs are not reaching the expected teams. The current allocation table has no dates and can contain several memberships per person.',
		payoff: 'Noah’s directory row survives with no department match. That explains a missing routing reference. The current table cannot prove when an allocation disappeared or who removed it.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-join-tables-allocation-handoffs',
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
			<Par>Purpose: Inspect departmental handoffs for affected staff.</Par>
			<Par>Goal: Preserve staff who have no allocation through an outer join.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Preserve staff who have no allocation through an outer join.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Use LEFT JOIN at both relationship steps. Filtering out null departments would hide the missing handoff.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
