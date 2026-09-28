import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve an overview of department names and their budget per employee, sorted from highest to lowest. Exclude the departments of Human Resources, Customer Support and Public Relations in this overview. For equal amounts, sort by department name ascending.</>
}

const solution = `
SELECT d_name AS name,
       budget / nr_employees AS expenditure
FROM departments
WHERE d_name NOT IN ('Human Resources', 'Customer Support', 'Public Relations')
ORDER BY expenditure DESC, name;`

export default {
	exerciseId: 'multi-criterion-departments-expenditure',
	definition: {
		metadata: { version: 2 },
		solution,
		comparisonOptions: { requireEqualRowOrder: true },
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
