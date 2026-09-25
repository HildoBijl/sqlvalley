import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find all the job positions where at some point someone performed less than a performance score of 60. Ensure there are no duplicates.</>
}

const solution = `
SELECT DISTINCT position
FROM contracts
WHERE perf_score < 60;`

export default {
	exerciseId: 'tough-positions',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
