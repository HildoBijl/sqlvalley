import { TargetBoundsDrawingFigure, MeasuredDrawingFigure, Curve, Rectangle, useDrawingTextTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { ISQL, DrawingTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Warning, Info, Term, Em } from '@/ui'
import { FigureHtml, TableQueryFigure, useTheoryPageDatabase } from '@/learning'

export const adjustedProducts = `SELECT
  p_id, name, category,
  CASE WHEN p_id = 100599 THEN 'nonexistent' ELSE owned_by END AS owned_by,
  est_value, status FROM products`

export function Theory() {
	return <Page>
		<Section>
			<Par>We know that foreign keys can be used as references to other tables. We can use this to combine various tables into one big table. Let's take a look at how that works.</Par>
		</Section>

		<Section title="Join: use a foreign key to pull tables together">
			<Par>Let's consider two tables that are linked through a foreign key. For instance consider the tables for products (with <ISQL>owned_by</ISQL>) and accounts (with <ISQL>username</ISQL>).</Par>
			<FigureTwoTables />
			<Par>Let's say that we want a list of all products <Em>including</Em> all attributes of the corresponding owners. In other words, we want all data in one big table. We could combine the two tables into one: we can <Term>join</Term> the tables.</Par>
			<Par>For the join to make sense, we must have one table (often placed on the left) with a foreign key to the other table (placed on the right). To execute the join, we walk through all the rows of the left table, and look up the respective record of the right table. We add this data to the back of the row. If we do this for all rows, we get the joined table. It has columns from both tables.</Par>
			<TableQueryFigure query={`SELECT * FROM products p JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={2200} />
		</Section>

		<Section title="Decomposition: split a table into two through a foreign key">
			<Par>Note that in the joined table we found above, there could be duplicate data. If one owner sells multiple products, then their contact data is mentioned multiple times! Storing such a table is not good database design. When we have a table like this in our database, we should perform a decomposition. A <Term>decomposition</Term> is the opposite of a join: it splits a table up into two separate linked tables.</Par>
			<Par>When decomposing a table, we basically take three steps.</Par>
			<List useNumbers items={[
				<>Make a list of all the attributes that might potentially be repeated, and should be grouped into a separate table. For the example above, that's all user data, being <ISQL>{`{username, phone, email, verified, first_name, last_name, address, city, created_at, last_login_at}`}</ISQL>.</>,
				<>Set up this new separate table. When doing so, ensure there are no duplicate rows, and define the table's primary key. For the example, we use <ISQL>username</ISQL> as primary key.</>,
				<>Remove all respective columns from the large table <Em>except</Em> the ones we put in the primary key. These are kept, to be used as foreign key. In the example, we use <ISQL>username</ISQL> as primary key and, for clarity, rename it as <ISQL>owned_by</ISQL>.</>,
			]} />
			<Par>If we take these steps for the above example, we wind up with the two tables we started with. We effectively pulled out the right table, and the remains became the left table.</Par>
			<FigureTwoTables />
		</Section>

		<Section title="The formal definition: a Cartesian product and a filter">
			<Par>The formal definition of the join is <Em>not</Em> what is stated above. It is slightly more complex, and consists of two steps.</Par>
			<List useNumbers items={[
				<>
					<Par sx={{ mb: 1 }}>Find the <Term>Cartesian product</Term> of the two tables. This is the table with all possible combinations of one row from the left table and one row from the right table. This is a huge table, but we'll show it below anyway for our example data. Note that every combination of rows from the two tables is present.</Par>
					<TableQueryFigure query={`SELECT * FROM products, accounts;`} tableWidth={2200} tableScale={0.35} />
				</>,
				<>
					<Par sx={{ mb: 1 }}>Only keep the row combinations that are relevant, filtering out the rest. Here,  "relevant" means "having equal foreign key". So we only keep the rows where <ISQL>owned_by</ISQL> equals <ISQL>username</ISQL>. This completes the join.</Par>
					<TableQueryFigure query={`SELECT * FROM products, accounts WHERE owned_by=username;`} tableWidth={2200} tableScale={0.6} />
				</>,
			]} />
			<Info>The above definition of a join, through a Cartesian product, is a <Em>generalization</Em> of the idea we saw earlier. The lookup idea we saw earlier only works when the foreign key is unique in the second (for us <ISQL>accounts</ISQL>) table. If this is not the case, for instance because multiple accounts have the same username, then the lookup fails. This generalized method with the Cartesian product always works.</Info>
		</Section>

		<Section title="The natural join: require equal-named columns to be equal">
			<Par>Whenever we do a join, we have to specify how this join is performed: which foreign key is used? In other words, which attributes are required to be equal?</Par>
			<Par>In practice, it often happens that the join is performed on attributes with the <Em>same name</Em>. When this is the case, we can apply a short-cut: the so-called natural join. A <Term>natural join</Term> is a join where we require all <Em>equally-named attributes</Em> to be equal. Effectively, we use the equally-named attributes as foreign key. This is a trick that at times can save us from having to specify on which attributes to join the tables.</Par>
			<Par>Let's show how this works with the example from before. Currently, when we join the tables, we have to specify that <ISQL>owned_by</ISQL> from one table has to equal <ISQL>username</ISQL> from the other table. But what if, within the <ISQL>products</ISQL> table, the attribute was already called <ISQL>username</ISQL>? In that case, we could instantly perform a natural join. We wouldn't have to specify anymore how to perform the join, as it's implicit!</Par>
			<FigureNaturalJoin />
			<Warning>Using natural joins in practice is somewhat risky. If both tables wind up getting some other column with equal name (columns named "name", "date" or "quantity" are very common after all) then this attribute is automatically used in the join as well. The natural join requires this attribute to be equal too! Because of this easy oversight, natural joins are in practice discouraged.</Warning>
		</Section>

		<Section title="Outer joins: keep rows with missing references">
			<Par>Let's study the joining of products and accounts again. There's two issues that we haven't yet looked at.</Par>
			<List items={[
				<Par key={1}>First, there are accounts that don't own any products. These accounts are not present in the joined table. But what if we don't want to lose their data?</Par>,
				<Par key={2}>Second, so far all products have an existing owner. But what if this is not the case?</Par>,
			]} />
			<Par>To show how we can deal with this, we first "mess up" our data a bit: we change the owner of "Studio with Copper Vessel" to a non-existing account with username "nonexistent".</Par>
			<FigureTwoTablesAdjusted />
			<Par>If we join the tables again, how do we deal with these missing links? There are actually four common ways to deal with this.</Par>
			<List items={[
				<>
					<Par>In the <Term>inner join</Term> (the default method) accounts without a product or products without an existing owner are ignored during the join. Since no valid matching is present, these entries disappear completely.</Par>
					<Par sx={{ my: 1 }}><TableQueryFigure query={`SELECT * FROM (${adjustedProducts}) p INNER JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={2200} /></Par>
				</>,
				<>
					<Par>In the <Term>left (outer) join</Term> we <Em>always</Em> keep the rows from the left table (products). If no matching row exists from the right table (accounts) then we use the special <ISQL>NULL</ISQL> value to show something is missing. (But rows from the right table will still disappear on missing matchings.) In our example, we see that the product with the nonexistent owner is included in the result.</Par>
					<Par sx={{ my: 1 }}><TableQueryFigure query={`SELECT * FROM (${adjustedProducts}) p LEFT JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={2200} /></Par>
				</>,
				<>
					<Par>In the <Term>right (outer) join</Term> we <Em>always</Em> keep the rows from the right table (accounts). If no matching row exists from the left table (products) then we use the special <ISQL>NULL</ISQL> value to show something is missing. (But rows from the left table will still disappear on missing matchings.) In our example, we see that all accounts without products are now included in the result.</Par>
					<Par sx={{ my: 1 }}><TableQueryFigure query={`SELECT * FROM (${adjustedProducts}) p RIGHT JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={2200} /></Par>
				</>,
				<>
					<Par>In the <Term>full (outer) join</Term> we <Em>always</Em> keep the rows from <Em>both</Em> tables. If any row from either table is without a matching row from the other table, we include <ISQL>NULL</ISQL> values. This ensures data never disappears.</Par>
					<Par sx={{ my: 1 }}><TableQueryFigure query={`SELECT * FROM (${adjustedProducts}) p FULL JOIN accounts a ON p.owned_by=a.username;`} tableScale={0.5} tableWidth={2200} /></Par>
				</>,
			]} />
			<Info>Note that the distinction of natural/non-natural join is completely separate from the distinction of inner/outer join. The first issue is about "Do we manually specify on which attributes to perform the join, or do we just pick equally named attributes?" The second issue is about "How do we handle entries without a matching reference?" When we talk about a "join" we usually refer to the the non-natural inner join, but you could very well apply a natural full outer join too.</Info>
		</Section>
	</Page>
}

export function FigureTwoTables() {
	const db = useTheoryPageDatabase()
	const data1 = useQueryResult(db, 'SELECT * FROM products;')
	const data2 = useQueryResult(db, 'SELECT * FROM accounts;')
	const tableScale = 0.7
	return <TargetBoundsDrawingFigure targets={['table1Title', 'table1', 'table2Title', 'table2']} maxWidth={1000} style={{ fontSize: 16 }}>
		<FigureHtml target="table1" position={[0, 25]} anchor={[-1, -1]} scale={tableScale}>
			<DrawingTable data={data1} width={900} />
		</FigureHtml>
		<FigureHtml target="table1Title" position={{ target: 'table1', anchor: 'topLeft', pixelOffset: [10, 2] }} anchor="bottomLeft"><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of products</span></FigureHtml>

		<FigureHtml target="table2" position={[80, 140]} anchor={[-1, -1]} scale={tableScale}>
			<DrawingTable data={data2} width={1350} />
		</FigureHtml>
		<FigureHtml target="table2Title" position={{ target: 'table2', anchor: 'topRight', pixelOffset: [-10, 2] }} anchor="bottomRight"><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of accounts</span></FigureHtml>
	</TargetBoundsDrawingFigure>
}

function FigureNaturalJoin() {
	return <MeasuredDrawingFigure
		targets={['table1', 'table2', 'table3']}
		calculateView={({ table2, table3 }) => ({ type: 'identity', width: 1025, height: 140 + table2.height + table3.height + 60 })}
		maxWidth={1000} style={{ fontSize: 16 }}>
		<FigureNaturalJoinContents />
	</MeasuredDrawingFigure>
}

function FigureNaturalJoinContents() {
	const themeColor = useThemeColor()

	// Get the data.
	const db = useTheoryPageDatabase()
	const query1 = 'SELECT p_id, name, category, owned_by AS username, est_value, status FROM products'
	const data1 = useQueryResult(db, query1)
	const data2 = useQueryResult(db, 'SELECT * FROM accounts;')
	const data3 = useQueryResult(db, `SELECT * FROM (${query1}) p NATURAL JOIN accounts a;`)

	// Set up reference to the table.
	const t1Bounds = useDrawingTargetBounds('table1')
	const t2Bounds = useDrawingTargetBounds('table2')

	useDrawingTextTarget('textNode1Bounds', 'table1', 'username', { index: 0, parentDepth: 1 })
	const textNode1Bounds = useDrawingTargetBounds('textNode1Bounds')
	useDrawingTextTarget('textNode2Bounds', 'table2', 'username', { index: 0, parentDepth: 1 })
	const textNode2Bounds = useDrawingTargetBounds('textNode2Bounds')
	const x = 80
	const y1 = 140
	const y2 = y1 + (t2Bounds?.height ?? 160)
	const y3 = y2 + 60
	const tableScale = 0.7
	const width = x + 1350 * tableScale
	const padding = 6

	return <>
		<FigureHtml position={[10, 0]} anchor={[-1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of products (owned_by renamed to username)</span></FigureHtml>
		<FigureHtml target="table1" position={[0, 25]} anchor={[-1, -1]} scale={tableScale} behind>
			<DrawingTable data={data1} width={900} />
		</FigureHtml>

		{t1Bounds ? <>
			<FigureHtml position={[width - 10, y1 - 25]} anchor={[1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of accounts</span></FigureHtml>
			<FigureHtml target="table2" position={[x, y1]} anchor={[-1, -1]} scale={tableScale} behind>
				<DrawingTable data={data2} width={1350} />
			</FigureHtml>

			{t2Bounds ? <>
				<Curve positions={[[width / 2, y2 + 4], [width / 2, y3 - 4]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
				<FigureHtml position={[width / 2 + 6, (y2 + y3) / 2 - 4]} anchor={[-1, 0]}><span style={{ fontWeight: 500, fontSize: '0.8em', color: themeColor }}>Natural join</span></FigureHtml>

				<FigureHtml target="table3" position={[0, y3]} anchor={[-1, -1]} scale={0.5}>
					<DrawingTable data={data3} width={width / 0.5} />
				</FigureHtml>
			</> : null}
		</> : null}

		{textNode1Bounds ? <Rectangle corners={[textNode1Bounds.min.add([-padding, -padding]), textNode1Bounds.max.add([padding, padding])]} cornerRadius={10} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} /> : null}
		{textNode2Bounds ? <Rectangle corners={[textNode2Bounds.min.add([-padding, -padding]), textNode2Bounds.max.add([padding, padding])]} cornerRadius={10} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} /> : null}
	</>
}

export function FigureTwoTablesAdjusted() {
	return <MeasuredDrawingFigure
		targets={['table1', 'table2']}
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

	// Set up reference to the table.
	useDrawingTextTarget('textNode1Bounds', 'table1', 'nonexistent', { index: 0, parentDepth: 1 })
	const textNode1Bounds = useDrawingTargetBounds('textNode1Bounds')
	const tableScale = 0.7
	const x = 80
	const y = 185
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
