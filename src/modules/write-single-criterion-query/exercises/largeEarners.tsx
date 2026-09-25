import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the first and last names of all the employees who currently earn more than 150,000. Ensure there are no duplicates.</>
}

const solution = `
SELECT DISTINCT first_name, last_name
FROM employees
WHERE current_salary > 150000;`

export default {
	exerciseId: 'large-earners',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
