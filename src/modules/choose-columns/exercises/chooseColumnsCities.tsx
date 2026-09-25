import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the list of all cities in which the employees of the company live, without duplicates.</>
}

const solution = `
SELECT DISTINCT city
FROM employees;`

export default {
	exerciseId: 'choose-columns-cities',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
