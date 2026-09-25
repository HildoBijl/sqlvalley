import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Create an overview of the IDs of all departments that ever had expenses and, for each respective department, the highest expense it ever incurred.</>
}

const solution = `
SELECT d_id, MAX(amount) AS highest_expense
FROM expenses
GROUP BY d_id;`

export default {
	exerciseId: 'aggregate-highest-expenses',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
