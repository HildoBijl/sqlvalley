import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all employees whose phone number starts with 408 and who live in either Mountain View or Santa Clara.</>
}

const solution = `
SELECT *
FROM employees
WHERE phone LIKE '408%'
  AND (city = 'Mountain View' OR city = 'Santa Clara');`

export default {
	exerciseId: 'multi-filter-phone-area',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
