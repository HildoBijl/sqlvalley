import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Find the first name and last name of accounts who appear as buyers in transactions related to "Musical Instruments" products, but never sold anything (of any type).</>
}

const solution = `
SELECT first_name, last_name
FROM accounts
WHERE username IN (
	SELECT buyer
	FROM transactions
  WHERE prod_id IN (
    SELECT p_id
    FROM products
    WHERE category = 'Musical Instruments'
  )
) AND username NOT IN (
	SELECT vendor
	FROM transactions
)`

export default {
	exerciseId: 'multitable-mock-in-notin',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
