import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Create an overview of all employees (their IDs) and their lowest and highest performance score ever obtained since January 1st, 2020 (going by contract end date). Limit the output to fluctuating employees: those where the difference between the lowest and highest score in this time period exceeds 40.</>
}

const solution = `
SELECT 
  e_id,
  MIN(perf_score) AS lowest_score,
  MAX(perf_score) AS highest_score
FROM contracts
WHERE end_date >= '2020-01-01'
GROUP BY e_id
HAVING MAX(perf_score) - MIN(perf_score) > 40;`

export default {
	exerciseId: 'filtered-aggregation-perf-range',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
