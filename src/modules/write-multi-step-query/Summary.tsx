import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, Quote, Info, Term } from '@/ui'
import { SQLQueryFigure } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>We can use the <ISQL>WITH</ISQL> statement before the <ISQL>SELECT</ISQL> clause to define <Term>named query results</Term>, formally known as <Term>Common Table Expressions (CTEs)</Term>. These CTEs are very useful to structure the queries we write, preventing us from repeating ourselves or getting queries within queries within queries.</Par>
			<Quote>Find the email addresses of all users involved (as vendor or buyer) in recorded transactions involving products with an estimated value above a million dollars, regardless of transaction status.</Quote>
			<SQLQueryFigure query={`
WITH high_value_products AS (
	SELECT p_id
	FROM products
	WHERE est_value > 1000000
), affected_transactions AS (
	SELECT *
	FROM transactions
	WHERE prod_id IN (SELECT p_id FROM high_value_products)
), affected_users AS (
	SELECT vendor AS username FROM affected_transactions
	UNION
	SELECT buyer AS username FROM affected_transactions
)

SELECT email
FROM accounts
WHERE username IN (SELECT username FROM affected_users);`} tableScale={0.8} tableWidth={250} />
			<Info>CTEs are aliases: they are forgotten again as soon as the query ends.</Info>
			<Par>Whenever writing complicated queries, it helps to set up many small and <Term>intuitive</Term> CTEs, <Term>based on keys</Term>. By building them up and <Term>testing</Term> them as we go, we make complex queries easier to build, understand, and test.</Par>
		</Section>
	</Page>
}
