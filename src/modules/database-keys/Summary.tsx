import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, List, Term, Info } from '@/ui'
import { TableSchema, TableQueryFigure } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>While table columns have names, table rows do not. To uniquely identify table rows, we use <Term>keys</Term>. There are three important definitions.</Par>
			<List items={[
				<>A <Term>superkey</Term> is a set of attributes such that, whenever two rows have the same value for these attributes, then the full rows are identical. Example superkeys include <ISQL>{`{username}`}</ISQL>, <ISQL>{`{username, email}`}</ISQL> and <ISQL>{`{first_name, last_name, city}`}</ISQL>.</>,
				<>A <Term>candidate key</Term> is a superkey for which, if we remove any attribute, it is not a superkey anymore. So a candidate key can be seen as a minimal superkey. Example candidate keys include <ISQL>{`{username}`}</ISQL> and <ISQL>{`{email}`}</ISQL>.</>,
				<>A <Term>primary key</Term> is a candidate key that we choose to use when referring to specific table rows. The primary key is ideally one whose value never changes. Using <ISQL>{`{username}`}</ISQL> is a wise choice here.</>
			]} />
			<Info>Given the example data below, <ISQL>{`{last_name, city}`}</ISQL> and even <ISQL>{`{first_name}`}</ISQL> would be valid candidate keys. However, when determining keys, it is crucial to also consider potential future data. The keys are determined by the rules of the application.</Info>
			<TableQueryFigure query={`SELECT * FROM accounts;`} title="List of user accounts" tableWidth={1400} tableScale={0.7} />
			<Par>When noting down the schema, the primary key is indicated through an underline.</Par>
			<List sx={{ mt: -1 }} items={[<TableSchema key="accounts" table="accounts" primaryKeys={['username']} />]} />
		</Section>
	</Page>
}
