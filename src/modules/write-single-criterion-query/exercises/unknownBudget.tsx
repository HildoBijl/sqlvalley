import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the ID and name of all the departments whose budget is not known.</>
}

const solution = `
SELECT d_id, d_name
FROM departments
WHERE budget IS NULL;`

export default {
	exerciseId: 'unknown-budget',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
