import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve the department names and manager names (first and last) of all departments whose manager was hired before 2018.</>
}

const solution = `
SELECT d_name, first_name, last_name
FROM departments AS d
JOIN employees AS e
ON d.manager_id = e.e_id
WHERE e.hire_date < '2018-01-01';`

export default {
	exerciseId: 'join-managers-hire-date',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
