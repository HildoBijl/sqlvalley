import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the first and last name of all employees that have ever worked as a warehouse associate.</>
}

const solution = `
SELECT first_name, last_name
FROM employees
WHERE e_id IN (
    SELECT e_id
    FROM contracts
    WHERE position = 'warehouse associate'
);`

export default {
	exerciseId: 'lookup-employee-position',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
