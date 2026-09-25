import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve the department ID, department name and budget of all departments. Ensure that the budget is called "available_money" as column name.</>
}

const solution = `
SELECT
  d_id,
  d_name,
  budget AS available_money
FROM departments;`

export default {
	exerciseId: 'choose-columns-department-budgets',
	definition: {
		solution,
		comparisonOptions: {
		requireEqualColumnNames: true,
		requireEqualColumnOrder: false,
	},
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
