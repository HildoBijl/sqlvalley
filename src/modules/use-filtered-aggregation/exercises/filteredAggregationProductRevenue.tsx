import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Create an overview of all products (their IDs), the number of incomplete transactions, and the total revenue from those incomplete transactions. Limit the output to those products whose average transaction value at these incomplete transactions is less than one million.</>
}

const solution = `
SELECT 
    prod_id,
    COUNT(*) AS tx_count,
    SUM(price) AS revenue
FROM transactions
WHERE status <> 'completed'
GROUP BY prod_id
HAVING AVG(price) < 1000000;`

export default {
	exerciseId: 'filtered-aggregation-product-revenue',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
