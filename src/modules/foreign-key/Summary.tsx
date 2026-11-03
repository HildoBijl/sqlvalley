import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, List, Term, Em } from '@/ui'
import { TableSchema, TableQueryFigure } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>When setting up a database, it is crucial to prevent <Term>duplicate data</Term>: the same data being stored in multiple places. Most importantly, this can lead to <Term>data inconsistency</Term>: data entries that contradict each other. This should be avoided at all times.</Par>
			<Par>To prevent duplicate data, tables often <Em>refer</Em> to one another through foreign keys. A <Term>foreign key</Term> in some table row functions as a reference that points to a row in another table, usually through its primary key. A foreign key can also refer to a row in the same table: a <Term>self-reference</Term>.</Par>
			<Par>An example of a foreign key is the <ISQL>owned_by</ISQL> column in the <ISQL>products</ISQL> table. It points to the <ISQL>accounts</ISQL> table through its primary key <ISQL>username</ISQL>. This reference allows us to look up contact info for the product's owner without having to store this information multiple times.</Par>
			<TableQueryFigure query="SELECT * FROM products;" title="List of products with the owner's username as reference" tableWidth={900} tableScale={0.8} />
			<Par>Within the schema, a foreign key is often marked italic. The context determines which table the foreign key refers to.</Par>
			<List sx={{ my: -1 }} items={[
				<TableSchema key="products" table="products" primaryKeys={['p_id']} foreignKeys={['owned_by']} />,
				<TableSchema key="accounts" table="accounts" primaryKeys={['username']} />,
			]} />
			<Par>In practice, database systems enforce <Term>referential integrity</Term>: they ensure that foreign key values always reference valid rows in the referenced table.</Par>
		</Section>
	</Page>
}
