import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Create an overview of all fiscal years and, for each respective fiscal year, the lowest and highest revenue obtained in any of its quarters.</>
}

const solution = `
SELECT fiscal_year, MIN(revenue) AS min_revenue, MAX(revenue) AS max_revenue
FROM quarterly_performance
GROUP BY fiscal_year;`

export default {
	exerciseId: 'aggregate-max-min-revenue',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
