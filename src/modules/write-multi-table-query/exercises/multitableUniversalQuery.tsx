import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the product categories of which all transactions have been validated by employees whose current salary is less than 200000.</>
}

const solution = `
SELECT DISTINCT p.category
FROM products p
WHERE NOT EXISTS (
	SELECT 1
	FROM products other
	JOIN transactions t ON t.prod_id = other.p_id
	WHERE other.category IS p.category
	  AND NOT EXISTS (
		SELECT 1 FROM employees e
		WHERE e.e_id = t.validated_by AND e.current_salary < 200000
	  )
)`

export default {
	exerciseId: 'multitable-universal-query',
	definition: {
		metadata: { version: 2 },
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
