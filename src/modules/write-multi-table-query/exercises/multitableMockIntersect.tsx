import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Retrieve the usernames of all users who have at some point bought one or more products from the "Fine Art" category, and who also appear as owners of products categorized as "Designer Fashion".</>
}

const solution = `
SELECT DISTINCT buyer
FROM transactions
WHERE prod_id IN (
	SELECT p_id
	FROM products
	WHERE category = 'Fine Art'
)
INTERSECT
SELECT DISTINCT owned_by
FROM products
WHERE category = 'Designer Fashion'`

export default {
	exerciseId: 'multitable-mock-intersect',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
