import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts, sorted first by performance score ascending, and for equal scores, by salary descending.</>
}

const solution = `
SELECT *
FROM contracts
ORDER BY perf_score ASC, salary DESC;`

export default {
	exerciseId: 'sort-by-perf-salary',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
