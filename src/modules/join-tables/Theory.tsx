import { MeasuredDrawingFigure, Rectangle, useDrawingTextTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { DrawingTable, ISQL, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Par, Quote, List, Section, Warning, Info, Term, Em } from '@/ui'
import { FigureHtml, SQLQueryFigure, useTheoryPageDatabase } from '@/learning'

const adjustedProducts = `SELECT
	p_id, name, category,
	CASE WHEN p_id = 100599 THEN 'nonexistent' ELSE owned_by END AS owned_by,
	est_value, status FROM products`

const productsReplacement = 'SELECT p_id, name, category, owned_by AS username, est_value, status FROM products'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know in theory what <Term>joining tables</Term> comes down to. SQL has a variety of ways in which tables can be joined: we can do so with the <ISQL>FROM/WHERE</ISQL> command or with the <ISQL>JOIN</ISQL> command. For the latter, there are various short-cuts and other options. Let's take a look at how all these possibilities work.</Par>
		</Section>

		<Section title={<>Join tables using <ISQL>FROM/WHERE</ISQL></>}>
			<Par>Suppose we get the following data request.</Par>
			<Quote>For each product with an estimated value of more than a million dollars, show its name, its owner (first and last name) and its status.</Quote>
			<Par>To set up such an overview, we need data from both the <ISQL>products</ISQL> table (the product name, estimated value and status) and the <ISQL>accounts</ISQL> table (the owner's first/last name). We have to join the two tables! How do we do so in SQL?</Par>
			<Par>We know that a join is basically a Cartesian product followed by a filter. To set up a Cartesian product in SQL, we can add multiple tables to the <ISQL>FROM</ISQL> clause. When we do, SQL sets up a large table with one row for each possible <Em>combination</Em> of rows from the first and second table.</Par>
			<SQLQueryFigure query={`SELECT *
FROM products, accounts;`} tableScale={0.35} tableWidth={770} below />
			<Warning>We can also take the Cartesian product of even more tables. Note that the number of rows in such a Cartesian product grows very rapidly. Be careful setting up the Cartesian product of several large tables.</Warning>
			<Par>To complete the join, we have to add a filter to the Cartesian product. Specifically, we require the foreign key reference to match: <ISQL>products.owned_by</ISQL> must equal <ISQL>accounts.username</ISQL>.</Par>
			<SQLQueryFigure query={`SELECT *
FROM products, accounts
WHERE products.owned_by = accounts.username;`} tableScale={0.6} tableWidth={1320} below />
			<Par>This has completed the join! The above query hence joins the two tables together.</Par>
			<Info>In the above query, we didn't need to use <ISQL>products.owned_by</ISQL> since there is only one column named <ISQL>owned_by</ISQL>. Just using <ISQL>owned_by</ISQL> would suffice. It's nevertheless still good practice to use table specifiers, to improve legibility. Someone else reading the query then doesn't have to wonder "Which table does that column come from?"</Info>
			<Par>To solve the given assignment, we can add extra filtering conditions, select the appropriate columns for the output, and use aliasing to shorten the notation. This gives the full query.</Par>
			<SQLQueryFigure query={`SELECT p.name, a.first_name, a.last_name, p.status
FROM products AS p, accounts AS a
WHERE p.owned_by = a.username AND p.est_value > 1000000;`} tableScale={0.7} tableWidth={700} />
		</Section>

		<Section title={<>Join tables using <ISQL>JOIN</ISQL></>}>
			<Par>Let's take a look at the <ISQL>WHERE</ISQL> clause of the above query. The first condition in this clause is a <Term>join condition</Term>: it is the requirement, when joining the tables, that the foreign keys are equal. The second condition is an <Term>external condition</Term>: for unrelated reasons, we are only interested in products with an estimated value of more than a million dollars. At the moment, the join conditions and external conditions are both mixed up in the same clause. That's confusing!</Par>
			<Par>To make queries easier to understand, it is helpful to keep join conditions and external conditions separate. That's exactly where the <ISQL>JOIN</ISQL> command comes in. Using <ISQL>JOIN</ISQL> goes in three steps. <List items={[
				<>Put one table in the <ISQL>FROM</ISQL> clause.</>,
				<>Use a <ISQL>JOIN</ISQL> clause to specify the second table to be joined in.</>,
				<>Add an <ISQL>ON</ISQL> clause that specifies the conditions required for the join.</>,
			]} /></Par>
			<SQLQueryFigure query={`SELECT *
FROM products
JOIN accounts
ON products.owned_by = accounts.username;`} tableScale={0.6} tableWidth={1320} below />
			<Par>The above query is a join in its simplest form. We can of course once more add in extra conditions with a <ISQL>WHERE</ISQL> clause, select columns at <ISQL>SELECT</ISQL>, and apply aliasing where appropriate.</Par>
			<SQLQueryFigure query={`SELECT p.name, a.first_name, a.last_name, p.status
FROM products AS p
JOIN accounts AS a
ON p.owned_by = a.username
WHERE p.est_value > 1000000;`} tableScale={0.7} tableWidth={700} />
			<Par>The above query does <Em>exactly</Em> the same as the join from before, but now we have smoothly separated our join conditions from our external conditions. It's easier to read!</Par>
		</Section>

		<Section title={<>Use the natural join short-cut</>}>
			<Par>Previously we required the column <ISQL>owned_by</ISQL> from one table to equal the column <ISQL>username</ISQL> from another table. In practice, it often happens that both columns related to a foreign key already have the same name. Perhaps the column <ISQL>owned_by</ISQL> actually already has the name <ISQL>username</ISQL>? In this case there are various short-cuts possible!</Par>
			<FigureNaturalJoinAdjustedTables />
			<Par>The first option is to use the <ISQL>NATURAL JOIN</ISQL>. This automatically requires all columns with equal name to be equal. When we use the natural join, the DBMS will go through the column names from both tables, find all pairs of matching column names, and it requires all these values to then be equal.</Par>
			<SQLQueryFigure query={`SELECT *
FROM products
NATURAL JOIN accounts;`} actualQuery={`SELECT *
FROM (${productsReplacement}) AS products
NATURAL JOIN accounts;`} tableScale={0.5} tableWidth={1100} below />
			<Par>This works well! But what happens when the two tables have another column name in common? What would we for instance do if both the column for product name <ISQL>name</ISQL> and the column for account last name <ISQL>last_name</ISQL> would be called <ISQL>name</ISQL>? In that case, the natural join would require these columns to be equal too! That's not what we want.</Par>
			<Par>For this use-case, there is an in-between solution: we can manually specify which columns have to be equal in the natural join. This is done through <ISQL>JOIN table_name USING (column_name1, column_name2, ...)</ISQL>. Note that the parentheses indicate a <Em>list</Em> of column names, but this list could also be a single column name.</Par>
			<SQLQueryFigure query={`SELECT *
FROM products
JOIN accounts
USING (username);`} actualQuery={`SELECT *
FROM (${productsReplacement}) AS products
JOIN accounts
USING (username);`} tableScale={0.5} tableWidth={1100} below />
			<Par>In this case, even if there are other columns with equal names, we only require the values in the <ISQL>username</ISQL> columns to be equal.</Par>
			<Info>The commands <ISQL>NATURAL JOIN</ISQL> and <ISQL>JOIN ... USING</ISQL> are short-cuts for <ISQL>JOIN ... ON</ISQL>: they do the exact same thing with less code. Well ... <Em>almost</Em> the same thing. They have one added benefit: they automatically remove duplicate columns. When using <ISQL>JOIN ... ON</ISQL>, there may be two columns <ISQL>username</ISQL> present after the join whose contents are exactly the same. When using these short-cuts, SQL neatly drops one of these columns, since the short-cuts inherently require these columns to have equal contents.</Info>
		</Section>

		<Section title={<>Use inner and outer joins</>}>
			<Par>When joining tables, there could be missing matches. Let's mess up our data and create some missing matches, to show how we can deal with them.
				<List items={[
					<>We change the owner of "Studio with Copper Vessel" to a non-existing account with username <ISQL>nonexistent</ISQL>.</>,
				]} /></Par>
			<FigureTwoTablesAdjusted />
			<Par>Note that there is now one product without an owner, and various accounts without a product. There are four ways to deal with these missing matches.</Par>
			<List items={[
				<>
					<Par>In the <Term>inner join</Term> any rows with missing matches are dropped from the output.</Par>
					<Par sx={{ my: 1 }}><SQLQueryFigure query={`SELECT *
FROM products AS p
INNER JOIN accounts AS a
ON p.owned_by = a.username`} actualQuery={`SELECT * FROM (${adjustedProducts}) p INNER JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={1100} below /></Par>
					<Info sx={{ my: 1 }}>The default join is the inner join. The commands <ISQL>JOIN</ISQL> and <ISQL>INNER JOIN</ISQL> do the exact same thing.</Info>
				</>,
				<>
					<Par>In the <Term>left (outer) join</Term> the rows from the left table are always kept.</Par>
					<Par sx={{ my: 1 }}><SQLQueryFigure query={`SELECT *
FROM products AS p
LEFT JOIN accounts AS a
ON p.owned_by = a.username`} actualQuery={`SELECT * FROM (${adjustedProducts}) p LEFT JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={1100} below /></Par>
				</>,
				<>
					<Par>In the <Term>right (outer) join</Term> the rows from the right table are always kept.</Par>
					<Par sx={{ my: 1 }}><SQLQueryFigure query={`SELECT *
FROM products AS p
RIGHT JOIN accounts AS a
ON p.owned_by = a.username`} actualQuery={`SELECT * FROM (${adjustedProducts}) p RIGHT JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={1100} below /></Par>
				</>,
				<>
					<Par>In the <Term>full (outer) join</Term> the rows from <Em>both</Em> tables are always kept.</Par>
					<Par sx={{ my: 1 }}><SQLQueryFigure query={`SELECT *
FROM products AS p
FULL JOIN accounts AS a
ON p.owned_by = a.username`} actualQuery={`SELECT * FROM (${adjustedProducts}) p FULL JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={1100} below /></Par>
				</>,
			]} />
		</Section>
	</Page>
}

function FigureNaturalJoinAdjustedTables() {
	return <MeasuredDrawingFigure
		targets={['table2']}
		calculateView={({ table2 }) => ({ type: 'identity', width: 1025, height: 140 + table2.height })}
		maxWidth={1000} style={{ fontSize: 16 }}>
		<FigureNaturalJoinAdjustedTablesContents />
	</MeasuredDrawingFigure>
}

function FigureNaturalJoinAdjustedTablesContents() {
	const themeColor = useThemeColor()

	// Get the data.
	const db = useTheoryPageDatabase()
	const query1 = productsReplacement
	const data1 = useQueryResult(db, query1)
	const data2 = useQueryResult(db, 'SELECT * FROM accounts;')

	useDrawingTextTarget('textNode1Bounds', 'table1', 'username', { index: 0, parentDepth: 1 })
	const textNode1Bounds = useDrawingTargetBounds('textNode1Bounds')
	useDrawingTextTarget('textNode2Bounds', 'table2', 'username', { index: 0, parentDepth: 1 })
	const textNode2Bounds = useDrawingTargetBounds('textNode2Bounds')
	const x = 80
	const y = 140
	const tableScale = 0.7
	const padding = 6

	return <>
		<FigureHtml position={[10, 0]} anchor={[-1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of products (owned_by renamed to username)</span></FigureHtml>
		<FigureHtml target="table1" position={[0, 25]} anchor={[-1, -1]} scale={tableScale} behind>
			<DrawingTable data={data1} width={900} />
		</FigureHtml>

		<FigureHtml position={[x + 1350 * tableScale - 10, y - 25]} anchor={[1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of accounts</span></FigureHtml>
		<FigureHtml target="table2" position={[x, y]} anchor={[-1, -1]} scale={tableScale} behind>
			<DrawingTable data={data2} width={1350} />
		</FigureHtml>

		{textNode1Bounds ? <Rectangle corners={[textNode1Bounds.min.add([-padding, -padding]), textNode1Bounds.max.add([padding, padding])]} cornerRadius={10} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} /> : null}
		{textNode2Bounds ? <Rectangle corners={[textNode2Bounds.min.add([-padding, -padding]), textNode2Bounds.max.add([padding, padding])]} cornerRadius={10} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} /> : null}
	</>
}

function FigureTwoTablesAdjusted() {
	return <MeasuredDrawingFigure
		targets={['table2']}
		calculateView={({ table2 }) => ({ type: 'identity', width: 1025, height: 185 + table2.height + 35 })}
		maxWidth={1000} style={{ fontSize: 16 }}>
		<FigureTwoTablesAdjustedContents />
	</MeasuredDrawingFigure>
}

function FigureTwoTablesAdjustedContents() {
	const themeColor = useThemeColor()

	// Get the data.
	const db = useTheoryPageDatabase()
	const data1 = useQueryResult(db, adjustedProducts)
	const data2 = useQueryResult(db, 'SELECT * FROM accounts;')

	useDrawingTextTarget('textNode1Bounds', 'table1', 'nonexistent', { index: 0, parentDepth: 1 })
	const textNode1Bounds = useDrawingTargetBounds('textNode1Bounds')
	const x = 80
	const y = 185
	const tableScale = 0.7
	const padding = 6

	return <>
		<FigureHtml position={[10, 0]} anchor={[-1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of products</span></FigureHtml>
		<FigureHtml target="table1" position={[0, 25]} anchor={[-1, -1]} scale={tableScale} behind>
			<DrawingTable data={data1} width={900} />
		</FigureHtml>

		<FigureHtml position={[x + 1350 * tableScale - 10, y - 25]} anchor={[1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of accounts</span></FigureHtml>
		<FigureHtml target="table2" position={[x, y]} anchor={[-1, -1]} scale={tableScale}>
			<DrawingTable data={data2} width={1350} />
		</FigureHtml>

		{textNode1Bounds ? <Rectangle corners={[textNode1Bounds.min.add([-padding, -padding]), textNode1Bounds.max.add([padding, padding])]} cornerRadius={10} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} /> : null}
	</>
}
