import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Create an overview of all sick leaves. More specific: find the names (first and last) of all employees who have been on sick leave. Also include the starting date and ending date of the respective contract in which they had sick leave. (In case of multiple contracts with sick leave, include multiple rows.)</>
}

const solution = `
SELECT first_name, last_name, start_date, end_date
FROM employees
NATURAL JOIN contracts
WHERE status = 'sick leave';`

export default {
	exerciseId: 'join-employee-leave',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
