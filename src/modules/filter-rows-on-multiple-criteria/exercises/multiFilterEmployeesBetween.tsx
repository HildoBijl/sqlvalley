import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all departments where the number of employees is not between 10 and 20 (inclusive), and whose budget is known.</>
}

const solution = `
SELECT *
FROM departments
WHERE nr_employees NOT BETWEEN 10 AND 20
  AND budget IS NOT NULL;`

export default {
	exerciseId: 'multi-filter-employees-between',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
