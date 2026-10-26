import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the names of the departments whose manager lives in Palo Alto.</>
}

const solution = `
SELECT d_name
FROM departments
WHERE manager_id IN (
    SELECT e_id
    FROM employees
    WHERE city = 'Palo Alto'
);`

export default {
	exerciseId: 'lookup-manager-city',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
