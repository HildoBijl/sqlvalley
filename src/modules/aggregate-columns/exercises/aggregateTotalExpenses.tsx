import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Create an overview of the IDs of all departments that ever had expenses and, for each respective department, the total expenses incurred.</>
}

const solution = `
SELECT d_id, SUM(amount) AS total_expenses
FROM expenses
GROUP BY d_id;`

export default {
	exerciseId: 'aggregate-total-expenses',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
