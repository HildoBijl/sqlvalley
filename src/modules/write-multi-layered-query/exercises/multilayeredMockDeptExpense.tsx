import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve the id, budget and total amount spent of all the departments whose total recorded expenses never exceeded their allocated budget.</>
}

const solution = `
WITH dept_expenses AS (
	SELECT d_id, SUM(amount) AS total_spent
	FROM expenses
	GROUP BY d_id
),
dept_budget AS (
	SELECT d_id, budget
	FROM departments
)
SELECT b.d_id, b.budget, e.total_spent
FROM dept_budget b
JOIN dept_expenses e ON b.d_id = e.d_id
WHERE e.total_spent <= b.budget`

export default {
	exerciseId: 'multilayered-mock-dept-expense',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
