import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts with performance score under 80.</>
}

const solution = `
SELECT *
FROM contracts
WHERE perf_score < 80;`

export default {
	exerciseId: 'filter-rows-lt-amount',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
