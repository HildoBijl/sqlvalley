import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve the employee ID, status, and monthly salary of employees whose status is active and whose monthly salary is either above 10,000 or below 1,000.</>
}

const solution = `
SELECT e_id, status, salary / 12 AS monthly_salary
FROM contracts
WHERE status = 'active'
  AND (salary / 12 > 10000 OR salary / 12 < 1000);`

export default {
	exerciseId: 'multi-criterion-work-status-active',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
