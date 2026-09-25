import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>For all contracts, retrieve the employee ID, start date, and the ratio of salary to performance score.</>
}

const solution = `
SELECT e_id, start_date, salary / perf_score AS pay_ratio
FROM contracts;`

export default {
	exerciseId: 'process-pay-ratio',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
