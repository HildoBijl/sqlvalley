import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts where the start date and end date are the same.</>
}

const solution = `
SELECT *
FROM contracts
WHERE start_date = end_date;`

export default {
	exerciseId: 'filter-rows-equal-date',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
