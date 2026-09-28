import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts, sorted first by performance score ascending, and for equal scores, by salary descending. For equal scores and salaries, sort by employee ID, start date and position, all ascending.</>
}

const solution = `
SELECT *
FROM contracts
ORDER BY perf_score ASC, salary DESC, e_id, start_date, position;`

export default {
	exerciseId: 'sort-by-perf-salary',
	definition: {
		metadata: { version: 2 },
		solution,
		comparisonOptions: { requireEqualRowOrder: true },
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
