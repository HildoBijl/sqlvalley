import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve the first 10 employees (their ID, start date, position and performance score) whose start date falls between January 1 and September 30 of 2025 (inclusive), sorted by start date.</>
}

const solution = `
SELECT e_id, start_date, position, perf_score
FROM contracts
WHERE start_date BETWEEN '2025-01-01' AND '2025-09-30'
ORDER BY start_date
LIMIT 10;`

export default {
	exerciseId: 'multi-criterion-start-date-range',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
