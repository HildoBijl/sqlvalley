import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve 5 departments with the smallest budgets, skipping the first 3. Put departments with unknown budget at the end. For equal budgets, sort by department ID ascending.</>
}

const solution = `
SELECT *
FROM departments
ORDER BY budget ASC NULLS LAST, d_id
LIMIT 5 OFFSET 3;`

export default {
	exerciseId: 'sort-dept-budget-skip',
	definition: {
		metadata: { version: 2 },
		solution,
		comparisonOptions: { requireEqualRowOrder: true },
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
