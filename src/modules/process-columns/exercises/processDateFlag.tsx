import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>For all contracts, retrieve the employee ID and a flag indicating if the start date is after the end date. (The flag is TRUE or 1 when the start date is after the end date, and FALSE or 0 when this is not the case. When any of the dates is NULL, the flag is also NULL.)</>
}

const solution = `
SELECT e_id, start_date > end_date AS wrong_info
FROM contracts;`

export default {
	exerciseId: 'process-date-flag',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
