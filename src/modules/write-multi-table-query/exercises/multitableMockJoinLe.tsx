import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>List the email addresses of unverified accounts who have bought a product for less than half of its estimated value.</>
}

const solution = `
SELECT email
FROM accounts
WHERE email_verified = FALSE AND username IN (
  SELECT t.buyer
  FROM products AS p
  JOIN transactions AS t
  ON t.prod_id = p.p_id
  WHERE t.price < 0.5*p.est_value
)`

export default {
	exerciseId: 'multitable-mock-join-le',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
