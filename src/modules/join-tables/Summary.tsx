import { ISQL } from '@sqlvalley/sql'

import { Page, Par, List, Section, Term } from '@/ui'
import { SQLQueryFigure } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>SQL has a variety of ways in which tables can be joined. To join two tables using <ISQL>FROM/WHERE</ISQL>, we take two steps.</Par>
			<List useNumbers items={[
				<>Add the two tables we want to join to the <ISQL>FROM</ISQL> clause. This creates the Cartesian product of the two tables.</>,
				<>Specify in the <ISQL>WHERE</ISQL> clause the <Term>join conditions</Term>: what must hold for each combination of rows.</>,
			]} />
			<SQLQueryFigure query={`SELECT *
FROM products, accounts
WHERE products.owned_by = accounts.username;`} tableScale={0.6} tableWidth={1320} below />
			<Par>The above solution is considered unclean because, within the <ISQL>WHERE</ISQL> clause, the join conditions will get mixed up with any potential <Term>external conditions</Term> we may still add later on. It is better for the query readability to keep join conditions and external conditions separate. We can fix this using the <ISQL>JOIN ... ON</ISQL> command. The join conditions are now placed after <ISQL>ON</ISQL>. Any further conditions can be added afterwards with <ISQL>WHERE</ISQL>.</Par>
			<SQLQueryFigure query={`SELECT *
FROM products
JOIN accounts
ON products.owned_by = accounts.username;`} tableScale={0.6} tableWidth={1320} below />
			<Par>When the attributes from the two tables already have the same name, then there are various short-cuts we can use. <ISQL>FROM table1 NATURAL JOIN table2</ISQL> matches two tables based on all columns with the same name. Or <ISQL>FROM table1 JOIN table2 USING (column_name1, column_name2, ...)</ISQL> matches tables based on the specified columns. In either case, we don't have to specify the join condition using <ISQL>ON</ISQL> anymore.</Par>
			<Par>SQL supports inner and outer joins. Consider the case where the rows from the two tables do not always have corresponding matching rows in the other table. <List items={[
				<>Use <ISQL>INNER JOIN</ISQL> to drop any rows with missing matches. (This is default, so <ISQL>INNER JOIN</ISQL> does the same as <ISQL>JOIN</ISQL>.)</>,
				<>Use <ISQL>LEFT JOIN</ISQL> to always keep rows from the left table: the one mentioned at <ISQL>FROM</ISQL>.</>,
				<>Use <ISQL>RIGHT JOIN</ISQL> to always keep rows from the right table: the one mentioned at <ISQL>JOIN</ISQL>.</>,
				<>Use <ISQL>FULL JOIN</ISQL> to always keep rows from both tables.</>,
			]} /></Par>
		</Section>
	</Page>
}
