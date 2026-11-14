import { expenseCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-lookup-query',
	key: 'cost-centres',
	person: 'caesar',
	purpose: 'Identify the cost centre tied to the disputed requests.',
	goal: 'Use a correlated existence condition.',
	variants: expenseCases.map(item => ({
		problem: `Retrieve department ID and name for departments with at least one expense whose description is exactly ${item.description}.`,
		query: `SELECT d_id, d_name FROM departments AS d WHERE EXISTS (SELECT 1 FROM expenses AS x WHERE x.d_id = d.d_id AND x.description = ${sqlLiteral(item.description)})`,
		evidence: 'The budget holder needs the recorded cost centre before comparing request entries with retained purchase paperwork.',
		payoff: 'This identifies the cost centre charged in the request list. A department reference does not establish who entered or received money from a request.',
	})),
	explanation: 'The correlated subquery checks for a matching expense for each outer department.',
})
