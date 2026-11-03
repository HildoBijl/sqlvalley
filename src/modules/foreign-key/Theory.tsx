import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, List, Warning, Term, Em, Info } from '@/ui'
import { TableSchema, TableQueryFigure } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know how to uniquely identify rows in a table through a primary key. But how do we use this to link tables to each other?</Par>
		</Section>

		<Section title="The problem of duplicate data">
			<Par>Suppose that we have a list of products that may be for sale or are already sold.</Par>
			<TableQueryFigure query={`SELECT p_id, name, category, est_value, status FROM products;`} title="List of products" tableWidth={800} tableScale={0.8} />
			<Par>Products are owned (and put up for sale) by specific users. It would be nice if we could include the owner's phone number in the product list. Then people would know who to contact in case they want to buy the product. So we could set up a table like this:</Par>
			<TableQueryFigure query={`SELECT p.p_id, p.name, p.category, p.est_value, p.status, a.first_name, a.last_name, a.phone FROM products p LEFT JOIN accounts a ON p.owned_by=a.username;`} title="List of products with the owner's contact info" tableWidth={1100} tableScale={0.8} />
			<Par>Displaying this info is useful, but storing it like this would be a very bad idea. The reason is that many users' phone numbers now also appear in the list of products, often multiple times. And it's also still in the list of user accounts. We would have <Term>duplicate data</Term>!</Par>
			<Warning>
				<Par>Duplicate data is bad for three reasons. In increasing importance:</Par>
				<List sx={{ my: 0.5 }} items={[
					<>Duplicate data takes up more space. (Honestly, we don't care much about this.)</>,
					<>When something changes, duplicate data has to be changed in multiple places, which is more work. (This is a bit more serious.)</>,
					<>If you forget to change duplicate data somewhere, then you have contradicting data. There are two different phone numbers! Which one is correct? We call this <Term>data inconsistency</Term> and it is a serious issue.</>,
				]} />
				<Par>For these three reasons (well, mainly the latter) we should always avoid storing multiple copies of the same information.</Par>
			</Warning>
		</Section>

		<Section title="Foreign key: a reference to a row in another table">
			<Par>The solution to our problem lies in making references. We know that the <ISQL>accounts</ISQL> table has all user data, including contact information and such. So within the <ISQL>products</ISQL> table we only have to <Em>refer</Em> to the right row in the <ISQL>accounts</ISQL> table. And referring to a row in a table is generally done through its primary key! Every user account has a unique <ISQL>username</ISQL>. So if we add this to the <ISQL>products</ISQL> table as an <ISQL>owned_by</ISQL> attribute, we can always look up the respective contact information.</Par>
			<TableQueryFigure query={`SELECT * FROM products;`} title="List of products with the owner's username as reference" tableWidth={900} tableScale={0.8} />
			<Par>When the key of one table appears as reference in another table, then we say that this second table has a <Term>foreign key</Term> pointing to the first table. A common way to indicate a foreign key in the table's schema is by making the foreign key italic. A reader then has to derive from the context which table the foreign key refers to.</Par>
			<List items={[
				<TableSchema key="products" table="products" primaryKeys={['p_id']} foreignKeys={['owned_by']} />,
				<TableSchema key="accounts" table="accounts" primaryKeys={['username']} />,
			]} />
			<Info>A foreign key can also refer to a row in the same table. This is known as a <Term>self-reference</Term>. For instance, if the <ISQL>employees</ISQL> table has a <ISQL>supervisor_id</ISQL> column that references another row in the same table, then the table would refer to itself.</Info>
			<Par>To apply a foreign key, we look up values in steps. For example, if we want to know which phone number to call to buy a "Handwoven Wall Textile", we first look through the products to find its owner's username. This is <ISQL>theo_kinc2</ISQL>. We then jump to the account list, find the row (the user) corresponding to this username (Theodore Kincaid) and extract the respective phone number: <ISQL>206-760-4300</ISQL>. Looking things up like this is simple enough, and these references keep our database clean.</Par>
			<Info>When defining tables in a database, we usually also specify the foreign keys. Databases make use of this: they check that the foreign key values reference existing rows in the referenced table. In this way, <Term>referential integrity</Term> is maintained. If a foreign key value does not reference an existing row, the database will reject the insertion or update.</Info>
		</Section>
	</Page>
}
