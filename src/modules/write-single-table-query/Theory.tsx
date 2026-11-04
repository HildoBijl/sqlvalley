import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, Quote, List, Warning, Info, Term, Em } from '@/ui'
import { SQLQueryFigure } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>By now we know, for any database table, how to process column values to create new columns, how to set up advanced filters, and how to apply sorting/limiting to the results. Next, we combine all these steps to set up complex multi-criterion queries.</Par>
		</Section>

		<Section title="The five steps of setting up a query">
			<Par>Suppose that we are ordered to get specific data out of a table. For example:</Par>
			<Quote>Find the salary that was actually paid per contract: the yearly salary scaled to the contract's duration, rounded to whole dollars. Only do so for ended contracts that lasted more than four weeks. Show the five contracts with the highest payouts.</Quote>
			<Par>To set up a query like this for a single table, there are generally five steps to follow. At first these steps add data, and then they start removing it, so that we only end up with the data that we need.</Par>
			<List useNumbers items={[
				<>Select all columns and where needed <Term>create extra columns</Term>. For our example, we first need the contract duration and then the actual salary paid: the payout.</>,
				<>Set up the <Term>filter</Term> to only get the entries required. For the example, we only want contracts that have ended and lasted more than four weeks.</>,
				<>If needed, <Term>sort and limit</Term> the entries. For the example, we need to sort by the payout, and only take the top 5.</>,
				<><Term>Cut columns</Term> to only get the required output. For the example, we only want the position and the payout.</>,
				<><Term>Remove duplicates</Term> if required. For the example, if there are two contracts with equal position and payout, they should likely both be included, so this is not needed.</>
			]} />
			<Par>To see how these steps work in practice, let's set up the corresponding query.</Par>
		</Section>

		<Section title="Practical application of the five steps">
			<Par>To start, we need to calculate contract duration. This is a date-based calculation, so the method depends on the DBMS. We have to look up which functions we can use. Google and Artificial Intelligence are a great way to gain ideas, and DBMS documentation is valuable to verify the details.</Par>
			<Par>For SQLite, there is a <ISQL>JULIANDAY(date)</ISQL> function that calculates the number of days since Nov 24, 4714 BC. We can use this to find the number of days of the contract, simply by finding the <Em>difference</Em> in number of days. So we use <ISQL>JULIANDAY(end_date) - JULIANDAY(start_date) AS duration</ISQL>.</Par>
			<Par>Once we have the duration, we can calculate the actual salary paid by scaling the yearly salary to the contract's duration, rounded off to the nearest dollar. We will assume a year is <ISQL>365.25</ISQL> days here.</Par>
			<SQLQueryFigure query={`SELECT
	*,
	JULIANDAY(end_date) - JULIANDAY(start_date) AS duration,
	ROUND((JULIANDAY(end_date) - JULIANDAY(start_date)) / 365.25 * salary) AS payout
FROM contracts;`} tableWidth={800} tableScale={0.8} below />
			<Par>As second step, we want to apply the filter. We only keep the contracts whose end date is defined, and whose duration is more than four weeks. There is one problem to keep in mind though.</Par>
			<Warning>When the DBMS evaluates the query, it starts with <ISQL>FROM</ISQL>, then applies <ISQL>WHERE</ISQL>, then <ISQL>SELECT</ISQL> (optionally with <ISQL>DISTINCT</ISQL>) and it ends with <ISQL>ORDER BY</ISQL> (optionally with <ISQL>LIMIT</ISQL>). Newly created columns get created at the <ISQL>SELECT</ISQL> step. We therefore usually <Em>cannot</Em> use newly defined column names within the <ISQL>WHERE</ISQL> clause! Some DBMSs do allow this through a work-around, but it's better not to count on this. The general fix is to copy the respective expression/calculation into the <ISQL>WHERE</ISQL> clause.</Warning>
			<SQLQueryFigure query={`SELECT
	*,
	JULIANDAY(end_date) - JULIANDAY(start_date) AS duration,
	ROUND((JULIANDAY(end_date) - JULIANDAY(start_date)) / 365.25 * salary) AS payout
FROM contracts
WHERE end_date IS NOT NULL
	AND JULIANDAY(end_date) - JULIANDAY(start_date) > 28;`} tableWidth={800} tableScale={0.8} below />
			<Par>For the third step, we sort and limit the results. We want to sort by the payout (high to low) and only take the top 5. (Now we <Em>can</Em> use new column names.)</Par>
			<SQLQueryFigure query={`SELECT
	*,
	JULIANDAY(end_date) - JULIANDAY(start_date) AS duration,
	ROUND((JULIANDAY(end_date) - JULIANDAY(start_date)) / 365.25 * salary) AS payout
FROM contracts
WHERE end_date IS NOT NULL
	AND JULIANDAY(end_date) - JULIANDAY(start_date) > 28
ORDER BY payout DESC
LIMIT 5;`} tableWidth={800} tableScale={0.8} below />
			<Par>As fourth step, we limit the columns we get. We were only instructed to find the payout per position, so we select those two columns, cutting out the rest.</Par>
			<Info>Note that we removed the newly created duration column again. It may seem pointless to add it first, but adding it in the initial output allows us to test it, which is a crucial step of the query writing process.</Info>
			<SQLQueryFigure query={`SELECT
	position,
	ROUND((JULIANDAY(end_date) - JULIANDAY(start_date)) / 365.25 * salary) AS payout
FROM contracts
WHERE end_date IS NOT NULL
	AND JULIANDAY(end_date) - JULIANDAY(start_date) > 28
ORDER BY payout DESC
LIMIT 5;`} tableWidth={300} tableScale={0.8} />
			<Par>Finally, we should check if we need to remove duplicates. For the example this is not the case: if two different contracts have the same position and payout, we should return them both. So this means we are done setting up the query.</Par>
			<Info>If you're struggling to set up a complicated query, it helps to simply follow these five steps. They usually get you to the desired query. And if not, then you can ask for help related to a specific step, like "How do I set up the filter?" This is far more powerful than just telling someone "I don't know how to do it."</Info>
		</Section>
	</Page>
}
