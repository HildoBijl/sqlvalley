import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve 5 departments with the smallest budgets, skipping the first 3. Put departments with unknown budget at the end.</>
}

const solution = `
SELECT *
FROM departments
ORDER BY budget ASC NULLS LAST
LIMIT 5 OFFSET 3;`

export default {
	exerciseId: 'sort-dept-budget-skip',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
