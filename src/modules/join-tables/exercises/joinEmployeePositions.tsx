import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>For all employees, make a list of the positions they have had. Give the first name, the last name and the position. A person may have multiple entries in case of multiple positions, but there should be no duplicates. Also include employees who never had a position.</>
}

const solution = `
SELECT DISTINCT first_name, last_name, position
FROM employees
NATURAL LEFT JOIN contracts;`

export default {
	exerciseId: 'join-employee-positions',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
