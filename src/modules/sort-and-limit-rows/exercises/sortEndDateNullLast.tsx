import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts of all employees, ordered by end date with later end dates shown first. Put everyone with an unlimited contract at the start. For equal end dates, sort by employee ID, start date and position, all ascending.</>
}

const solution = `
SELECT *
FROM contracts
ORDER BY end_date DESC NULLS FIRST, e_id, start_date, position;`

export default {
	exerciseId: 'sort-end-date-null-last',
	definition: {
		metadata: { version: 2 },
		solution,
		comparisonOptions: { requireEqualRowOrder: true },
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
