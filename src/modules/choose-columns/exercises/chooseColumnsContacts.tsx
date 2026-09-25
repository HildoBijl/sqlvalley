import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>List the first name, last name, email, and phone number of all employees. Ensure that the phone number is called "number" as column name.</>
}

const solution = `
SELECT
  first_name,
  last_name,
  email,
  phone AS number
FROM employees;`

export default {
	exerciseId: 'choose-columns-contacts',
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
