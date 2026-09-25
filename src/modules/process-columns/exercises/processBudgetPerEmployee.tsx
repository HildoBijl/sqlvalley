import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve the department ID, budget, number of employees, and the budget per employee for all departments.</>
}

const solution = `
SELECT d_id, budget, nr_employees,
       budget / nr_employees AS budget_per_employee
FROM departments;`

export default {
	exerciseId: 'process-budget-per-employee',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
