import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find all contracts for employees that started after 2023.</>
}

const solution = `
SELECT *
FROM contracts
WHERE start_date > '2023-12-31';`

export default {
	exerciseId: 'filter-rows-gt-date',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
