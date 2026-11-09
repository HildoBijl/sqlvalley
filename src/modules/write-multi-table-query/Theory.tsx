import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, Quote, List, Warning, Info, Term, Em } from '@/ui'
import { SQLQueryFigure } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know of multiple ways to combine data from multiple tables: we can look up records based on keys, or just join the tables altogether. These techniques form the basis behind all queries. But when the requests for data get complicated, it gets harder and harder to use these tools to set up the right queries. There is no query-writing strategy that works all the time, but there <Em>are</Em> various tricks that we can use. We'll study a few of them.</Par>
		</Section>

		<Section title="Trick 1. Improve your intuition of the data set: perform the query manually">
			<Par>Suppose that we have a list of products that can be sold, a list of customer accounts, and a list of transactions (who purchased which product). Let's consider a request.</Par>
			<Quote>Find the usernames of the accounts that bought a painting. (Ignore transaction statuses.)</Quote>
			<Par>To set up a query for this request (or any request for that matter), it helps to first perform the query manually. Browse through the tables and see what you would do yourself if you'd have to find the respective data without any computer.</Par>
			<Info>Why not go to the Data Explorer tab and briefly try this out for yourself?</Info>
			<Par>There are several thoughts that we could get when we try this. <List items={[
				<>To start, we go the accounts table, and for every account we go through all transactions where that account is the buyer, and for each transaction we look up the product, and see if it falls in the "painting" category. Soon we find that this will be a very slow process.</>,
				<>But then we realize that there are only a few "painting" products. So it might be better to first make a list of products that fall in the "painting" category? That makes it easier to check if a product is "painting".</>,
				<>Then we realize there might be accounts that have bought multiple "painting" products. If we find one, we don't have to browse further. That also simplifies matters.</>,
				<>And then we realize that we only need the username of the buyer, and no other info. So we don't need the accounts table at all!</>,
			]} /> Through these steps, we can simplify our manual process of finding the required data. Once we have a good process in our head of how we would efficiently get the data manually, we can start turning this process into a query.</Par>
		</Section>

		<Section title="Trick 2. Get rid of ambiguous language: rephrase the request">
			<Par>SQL would not understand the above example request. For starters, it does not know the concept of "buying", and the request also doesn't specify that "painting" refers to the <ISQL>category</ISQL> column. It helps to bring our English-language request a bit closer to something that SQL might understand, making the step of turning it into a query a bit smaller. Specifically, we can do two things.</Par>
			<List items={[
				<>Change all <Em>verbs</Em> to words that SQL is familiar with. SQL is strong with things like "exists", "is in a list", or similar.</>,
				<>Change all <Em>nouns</Em> to things that exist in our database: either table rows, or specific attributes within a row. When rows are linked through foreign keys, we can use the word "corresponding".</>,
			]} />
			<Par>If we use these ideas to rewrite the query, we can get the following.</Par>
			<Quote>Find the usernames of all accounts for which there exists a corresponding transaction (as buyer), where the corresponding product has category equal to "painting".</Quote>
			<Par>This is a query that can directly be turned into SQL. For "corresponding" we use a join, which gives the following result.</Par>
			<SQLQueryFigure query={`
SELECT DISTINCT username
FROM accounts AS a
JOIN transactions AS t
ON a.username = t.buyer
JOIN products AS p
ON t.prod_id = p.p_id
WHERE p.category = 'PAINTING';`} tableWidth={120} tableScale={0.8} />
			<Par>This gives us a first idea of a query to work with.</Par>
		</Section>

		<Section title="Trick 3. Optimize the result: try different tools">
			<Par>Once we have a query that works, we're far from done! Usually the first draft of a query is messy. It may be inefficient from a computational point of view, and hard for humans to understand on top of that. We can simplify it! This can be done using the intuitive ideas we found at trick 1, and/or by trying different tools within SQL. When doing so, it also helps to rewrite the English-language request, to check if it still means the same thing.</Par>
			<Par>Let's try this out on our example. We have already realized we don't really need the <ISQL>accounts</ISQL> table. We could cut that out. That gives the following request/query.</Par>
			<Quote>Find the usernames of the transaction buyers for which the corresponding product has a category equal to "PAINTING".</Quote>
			<SQLQueryFigure query={`
SELECT DISTINCT buyer
FROM transactions AS t
JOIN products AS p
ON t.prod_id = p.p_id
WHERE p.category = 'PAINTING';`} tableWidth={120} tableScale={0.8} />
			<Par>We have also realized that we could first create a list of all "painting" products. We then check if the product is in this list. Using this idea, we can again rewrite our request/query.</Par>
			<Quote>Find the usernames of the transaction buyers for which the corresponding product is in the list of products with category equal to "PAINTING".</Quote>
			<SQLQueryFigure query={`
SELECT DISTINCT buyer
FROM transactions
WHERE prod_id IN (
	SELECT p_id
	FROM products
	WHERE category = 'PAINTING'
);`} tableWidth={120} tableScale={0.8} />
			<Par>The latter query replaces the join with a list-based membership check. Joins are generally more computationally expensive to execute, so this is a good clean-up. In practice, DBMS optimizers may find such optimizations themselves, so we cannot always say this latter query is faster. But it's still good practice to simplify queries in this way when possible.</Par>
			<Info>Optimizing query performance is a big separate subject. It involves query plans, database indexes and more. We don't go into the details here. We'll only focus on getting the right data, which is the most important aspect of any query.</Info>
		</Section>

		<Section title={`Trick 4. Work in steps: set up sub-queries from inside to outside`}>
			<Par>In the last query we have applied two steps. First we created a list of painting products, and then we found the corresponding buyers of them. If we already know in advance (after trick 1) that we would do this, we could have built up our query step by step.</Par>
			<Par>First we find a list of all painting products. We can test it, to see if it works as intended.</Par>
			<Quote>Find the IDs of all products whose category equals "PAINTING".</Quote>
			<SQLQueryFigure query={`
SELECT p_id
FROM products
WHERE category = 'PAINTING';`} tableWidth={120} tableScale={0.7} />
			<Info>Testing parts of your query is very important. It's easy to make a mistake in SQL, so by testing early, you find your mistakes early, when it's still easy to identify them.</Info>
			<Par>Once we have this list, we can build the next step of our query <Em>around</Em> it.</Par>
			<Quote>Find the usernames of the transaction buyers for which the corresponding product is in the list of products whose category equals "PAINTING".</Quote>
			<SQLQueryFigure query={`
SELECT DISTINCT buyer
FROM transactions
WHERE prod_id IN (
	SELECT p_id
	FROM products
	WHERE category = 'PAINTING'
);`} tableWidth={120} tableScale={0.8} />
			<Par>In many applications, we may need to go further. Perhaps we don't just want the username of the buyer, but also the email address? Through this layered approach, it is very easy to add this. We just add another lookup.</Par>
			<Quote>Find the usernames and email addresses of the accounts for which the account ID is in the list of buyers for transactions where the corresponding product is in the list of products whose category equals "PAINTING".</Quote>
			<SQLQueryFigure query={`
SELECT username, email
FROM accounts
WHERE username IN (
	SELECT DISTINCT buyer
	FROM transactions
	WHERE prod_id IN (
		SELECT p_id
		FROM products
		WHERE category = 'PAINTING'
	)
);`} tableWidth={350} tableScale={0.8} />
			<Warning>Setting up a query from inside to outside, testing every step of the way, is very common. It does only work for non-correlated queries, and not for correlated queries. This is yet another reason to use non-correlated queries whenever possible.</Warning>
		</Section>

		<Section title={`Trick 5. Deal with the word "All": rephrase it using a double negative`}>
			<Par>Let's consider a more complicated request.</Par>
			<Quote>Find the employee IDs and names of the employees who are allocated to <strong>all</strong> departments.</Quote>
			<Par>The word "all" here is easy for humans to understand, but it completely changes the process. To see how, we could apply trick 1 and run the query manually.</Par>
			<List items={[
				<>We'd first have to find a list of all departments.</>,
				<>For each employee, we'd have to find all allocations, and look up the corresponding departments.</>,
				<>We'd have to then tick off the departments in our list, to see if an employee has <Em>all</Em> of them.</>,
				<>Once we've gone through all allocations for a given employee, we should check if we've ticked off all departments.</>,
			]} />
			<Par>It's a lot of work! Isn't there an easier trick?</Par>
			<Par>The solution is to use trick 2: we rephrase the request, and we do so using a negative. Keep in mind that SQL does not know the word "all" for a case like this, but it does know the word "exists". The word "all" means "there does not exist anything of the opposite". So we could rephrase our request using such a double negative.</Par>
			<Quote>Find the employee IDs and names of the employees for which there does not exist a department which the respective employee has not been allocated to.</Quote>
			<Par>Note that this request means the same as the one above, but then uses the words "exists" and "not" rather than "all". It's what we need to set up a query in SQL.</Par>
			<SQLQueryFigure query={`
SELECT e.e_id, e.first_name, e.last_name
FROM employees AS e
WHERE NOT EXISTS (
	SELECT 1
	FROM departments AS d
	WHERE NOT EXISTS (
		SELECT 1
		FROM allocations AS a
		WHERE a.e_id = e.e_id
			AND a.d_id = d.d_id
	)
);`} tableWidth={250} tableScale={0.8} />
			<Par>This query is harder to understand, because it is a correlated query: it uses the outer attribute <ISQL>e.e_id</ISQL> somewhere deep within its inner query. To understand it, it helps to see correlated queries as iterations.</Par>
			<List items={[
				<>In the outer layer, we iterate over all employees. Every time, we consider some employee ID <ISQL>e.e_id</ISQL>.</>,
				<>In the middle layer, we iterate over all departments. Every iteration, we consider some department ID <ISQL>d.d_id</ISQL>.</>,
				<>In the inner layer, we check whether there is an allocation for the given employee in the given department.</>,
			]} />
			<Par>Eventually, we find the employees for which there is no department which they have not been allocated to.</Par>
		</Section>

		<Section title={`Trick 6. Check your result using an example`}>
			<Par>The final step, whenever writing queries, always is to check your results. The best way to do so is using examples. Here we should check at least one <Term>positive</Term> example (that does appear in our output) and one <Term>negative</Term> example (that is omitted from the output).</Par>
			<Par>Consider once more the earlier example.</Par>
			<Quote>Find the usernames and email addresses of the accounts that bought a painting.</Quote>
			<SQLQueryFigure query={`
SELECT username, email
FROM accounts
WHERE username IN (
	SELECT DISTINCT buyer
	FROM transactions
	WHERE prod_id IN (
		SELECT p_id
		FROM products
		WHERE category = 'PAINTING'
	)
);`} tableWidth={300} tableScale={0.7} />
			<Par>To check if this is the correct output, we should take one random sample from this output, dive into the tables, and see if this person really meets the criteria. We can check user <ISQL>sabrina.shah</ISQL> for instance, and see that she indeed bought a "painting" product, the "Standing Form", from "aaron.olsen".</Par>
			<Info>When running these checks, the Data Explorer is your friend! But you can also quickly write some basic queries for support.</Info>
			<Par>To check a negative example, we take one (random) account that is <Em>not</Em> in our output. For instance, we consider the user <ISQL>aaron.olsen</ISQL> and look up the products that this user has bought. We can even write a quick query for this.</Par>
			<SQLQueryFigure query={`
SELECT t.t_id, t.buyer, p.p_id, p.name, p.category
FROM transactions AS t
JOIN products AS p
ON t.prod_id = p.p_id
WHERE t.buyer = 'aaron.olsen';`} tableWidth={500} tableScale={0.7} below />
			<Par>Indeed, this person has bought industrial and historic objects, but no paintings. This corresponds with the output of our query.</Par>
			<Warning>A check with such a small sample of course does not <Em>guarantee</Em> that our query is correct. To be fully certain, we'd have to check <Em>all</Em> possible accounts. But a quick check like this does filter out any obvious errors. It's always worthwhile to do so.</Warning>
		</Section>
	</Page>
}
