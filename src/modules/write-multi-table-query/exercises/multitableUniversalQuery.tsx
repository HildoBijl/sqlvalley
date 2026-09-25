import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the product categories of which all transactions have been validated by employees whose current salary is less than 200000.</>
}

const solution = `
SELECT DISTINCT category FROM products
EXCEPT
SELECT DISTINCT category FROM products WHERE p_id IN (
  SELECT prod_id FROM transactions WHERE validated_by IN (
    SELECT e_id FROM employees WHERE current_salary >= 200000
  )
)`

export default {
	exerciseId: 'multitable-universal-query',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
