import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the names of the departments whose manager has at some point been on sick leave.</>
}

const solution = `
SELECT d_name
FROM departments
WHERE manager_id IN (
    SELECT e_id
    FROM contracts
    WHERE status = 'sick leave'
);`

export default {
	exerciseId: 'lookup-manager-sick',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
