import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve all contracts where the employee is either on sick leave or paid leave, and the end date is after 2024.</>
}

const solution = `
SELECT *
FROM contracts
WHERE (status = 'paid leave' OR status = 'sick leave')
  AND end_date > '2024-12-31';`

export default {
	exerciseId: 'multi-filter-on-leave',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
