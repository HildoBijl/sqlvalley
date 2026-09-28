import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>Identify the username, amount spent and amount earned, for all users whose total revenue as vendor exceeds their total spending as buyer.</>
}

const solution = `
  WITH vendor_totals AS (
    SELECT vendor AS username, SUM(price) AS earned
    FROM transactions
    GROUP BY vendor
  ),
  buyer_totals AS (
    SELECT buyer AS username, SUM(price) AS spent
    FROM transactions
    GROUP BY buyer
  )
  SELECT v.username, COALESCE(b.spent, 0) AS spent, v.earned
  FROM vendor_totals v
  LEFT JOIN buyer_totals b ON v.username = b.username
  WHERE v.earned > COALESCE(b.spent, 0);`

export default {
	exerciseId: 'multilayered-mock-buyer-vendor',
	definition: {
		metadata: { version: 2 },
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
