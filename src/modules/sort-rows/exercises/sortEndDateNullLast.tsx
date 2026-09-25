import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts of all employees, ordered by end date with later end dates shown first. Put everyone with an unlimited contract at the start.</>
}

const solution = `
SELECT *
FROM contracts
ORDER BY end_date DESC NULLS FIRST;`

export default {
	exerciseId: 'sort-end-date-null-last',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
