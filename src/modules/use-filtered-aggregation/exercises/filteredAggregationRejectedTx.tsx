import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Create an overview of all vendors (their usernames), their total number of transactions with price larger than ten million, and the number of these that were rejected. Limit the output to those vendors with more than three such rejected large transactions.</>
}

const solution = `
SELECT 
  vendor,
  COUNT(*) AS total_tx,
  SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_tx
FROM transactions
WHERE price > 10000000
GROUP BY vendor
HAVING SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) > 3;`

export default {
	exerciseId: 'filtered-aggregation-rejected-tx',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
