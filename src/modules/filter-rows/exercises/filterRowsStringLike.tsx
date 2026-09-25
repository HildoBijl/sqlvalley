import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts that have the word "sick" anywhere in the status.</>
}

const solution = `
SELECT *
FROM contracts
WHERE status LIKE '%sick%';`

export default {
	exerciseId: 'filter-rows-string-like',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
