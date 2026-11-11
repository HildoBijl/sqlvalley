import { ISQL } from '@sqlvalley/sql'

import { Page, Par, List, Section, Info, Warning, Term, Em } from '@/ui'
import { SQLQueryFigure } from '@/learning'
import { ModuleLink } from '@/navigation'

export function Theory() {
	return <Page>
		<Section>
			<Par>We have seen a variety of ways to set up queries. Joining multiple tables together, applying advanced filters to select the right entries, processing the values, and aggregating the results. When performing all these steps, the queries may grow large, with queries inside queries inside queries. We need a way to manage all these steps.</Par>
		</Section>

		<Section title="The problem: queries tend to grow larger">
			<Par>Let's consider an example data request involving lots of tables. Suppose that we want to audit all recorded transactions involving products with an estimated value above a million dollars, regardless of transaction status. And all users (both vendors and buyers) involved in those transactions need to be notified: we need their email addresses. How would we go about getting those?</Par>
			<Par>First we need a list of products (their IDs) with an estimated value above a million dollars. That's still quite manageable.</Par>
			<SQLQueryFigure query={`
SELECT p_id
FROM products
WHERE est_value > 1000000;`} tableScale={0.8} tableWidth={120} />
			<Par>Then we need all recorded transactions involving these products. This results in a subquery.</Par>
			<SQLQueryFigure query={`
SELECT vendor, buyer
FROM transactions
WHERE prod_id IN (
	SELECT p_id
	FROM products
	WHERE est_value > 1000000
);`} tableScale={0.8} tableWidth={300} />
			<Par>We want a list of all involved users, so we need to merge the two lists. We can do that using a union.</Par>
			<SQLQueryFigure query={`
SELECT vendor AS username
FROM transactions
WHERE prod_id IN (
	SELECT p_id
	FROM products
	WHERE est_value > 1000000
)
UNION
SELECT buyer AS username
FROM transactions
WHERE prod_id IN (
	SELECT p_id
	FROM products
	WHERE est_value > 1000000
);`} tableScale={0.8} tableWidth={150} />
			<Par>The query becomes large, and we're not even there yet! And to make it worse, we're <Em>repeating</Em> ourselves. If we later on want to change the limit of a million dollars, then we need to do so in multiple places. Maybe someone changes it in one place and forgets to change it in the other place. We'd get a wrong query! We need a way to make this process easier.</Par>
		</Section>

		<Section title="Name intermediate query results">
			<Par>The key to our problem lies in naming <Term>intermediate query results</Term>. Before the main <ISQL>SELECT</ISQL>, use <ISQL>WITH</ISQL> to define a result that can be referenced like a table within the statement.</Par>
			<SQLQueryFigure query={`
WITH high_value_products AS (
	SELECT p_id
	FROM products
	WHERE est_value > 1000000
)

SELECT vendor AS username
FROM transactions
WHERE prod_id IN (SELECT p_id FROM high_value_products)
UNION
SELECT buyer AS username
FROM transactions
WHERE prod_id IN (SELECT p_id FROM high_value_products);`} tableScale={0.8} tableWidth={150} />
			<Par>These named results are formally called <Term>Common Table Expressions (CTEs)</Term>. They are very powerful tools at structuring queries and making them easier to read. But keep in mind that they are temporary: as soon as the query ends they are forgotten!</Par>
			<Info>The CTE is only defined as an alias for this specific query. Its definition is forgotten once the query ends! If you want to store persistent table aliases, look into <ModuleLink moduleId="database-view">database views</ModuleLink>.</Info>
			<Par>Instead of just one CTE, we can create more. We only use the <ISQL>WITH</ISQL> keyword once, but we add the table definitions separated by commas.</Par>
			<SQLQueryFigure query={`
WITH high_value_products AS (
	SELECT p_id
	FROM products
	WHERE est_value > 1000000
), affected_transactions AS (
	SELECT *
	FROM transactions
	WHERE prod_id IN (SELECT p_id FROM high_value_products)
)

SELECT vendor AS username FROM affected_transactions
UNION
SELECT buyer AS username FROM affected_transactions;`} tableScale={0.8} tableWidth={150} />
			<Warning>Most DBMSs require you to define CTEs in the right order: every CTE may only use CTEs defined before them, and not those after them. Using such an order is also strongly recommended from a readability point of view.</Warning>
			<Par>Let's continue extending our query. Now that the affected users are known, we should get their email addresses. We could do so through a nested query, but it's better to simply add yet another CTE.</Par>
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
			<Warning>You may wonder why we used <ISQL>WHERE username IN (SELECT username FROM affected_users)</ISQL> and not just <ISQL>WHERE username IN affected_users</ISQL>. The reason is that, in most DBMSs, the <ISQL>IN</ISQL> command expects a subquery or a list of values, not a table alias. Some DBMSs like SQLite do allow it, but it's not recommended to count on this.</Warning>
			<Par>The result we obtained is exactly what we wanted. The corresponding query is quite easy to read, given how many tables it touches. It is way easier than the alternative that we would have gotten without CTEs. Good luck making sense of the following query without any context!</Par>
			<SQLQueryFigure query={`
SELECT email
FROM accounts
WHERE username IN (
	SELECT vendor AS username
	FROM transactions
	WHERE prod_id IN (
		SELECT p_id
		FROM products
		WHERE est_value > 1000000
	)
	UNION
	SELECT buyer AS username
	FROM transactions
	WHERE prod_id IN (
		SELECT p_id
		FROM products
		WHERE est_value > 1000000
	)
);`} tableScale={0.8} tableWidth={250} />
		</Section>

		<Section title="Use common CTE tips and tricks">
			<Par>CTEs are a very powerful tool at structuring complex queries. When setting up the CTEs, there are a few tips and tricks that are useful to apply. We've already seen some of them applied in the example above, but it's useful to outline them all together.</Par>
			<List useNumbers items={[
				<>Start by <Term>executing the data request manually</Term>. When we do so, we often already generate lists (if only in our head) to support what we're doing. These lists are probably worthwhile to turn into CTEs.</>,
				<>Set up CTEs using <Term>keys</Term> (or combinations of keys). Keys are far easier to work with than full records. And if we have keys, we can easily include the relevant rows again through a lookup query.</>,
				<>Set up CTEs that are <Term>easy to understand</Term>. The name itself should already be clear about what exactly it represents. If this is not the case, we may want to reconsider the CTE we are setting up.</>,
				<>Work <Term>step by step</Term>. First we write a query and <Em>test</Em> if it works as intended. Once it does, we turn this query into a CTE and use it in the next query. We repeat this process as we work towards our final query.</>,
				<>Use <Term>small steps</Term> whenever possible. If our query is getting large, it probably means we should split it up into more CTEs. The simpler each CTE is, the better, even if we use more of them.</>,
			]} />
			<Par>With these tips and tricks, we make complex queries easier to build, understand, and test.</Par>
		</Section>
	</Page>
}
