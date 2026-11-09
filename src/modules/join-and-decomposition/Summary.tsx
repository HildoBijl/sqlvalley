import { MeasuredDrawingFigure, Curve, useDrawingTargetBounds } from '@step-wise/drawing'
import { ISQL, DrawingTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Info, Term, Em } from '@/ui'
import { FigureHtml, useTheoryPageDatabase } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>When two tables are linked through a foreign key, we can <Term>join</Term> them together into one larger table. We take the left table (which has the foreign key) and, for every foreign key, we look up the reference in the right table (which the foreign key refers to). The respective columns are added to the left table to form one larger joined table. For example, joining products to accounts through <ISQL>owned_by = username</ISQL> adds the owner's details to each product.</Par>
			<FigureJoinAndDecomposition />
			<Par>Formally a join is a <Term>Cartesian product</Term> (all possible combinations of one row from one table and another row from the other table) followed by a <Term>filter</Term> that requires the foreign keys to be equal.</Par>
			<Par>The opposite of a join is a <Term>decomposition</Term>: it splits the table back up into two separate tables. This is useful in case the larger table has duplicate data: by storing the decomposed tables, we can prevent storing duplicate data.</Par>
			<Par>Normally, when performing a join, we have to specify through which foreign key we join the tables. In the <Term>natural join</Term> we do not: we implicitly state that the foreign key used to join the tables consists of all <Em>equally-named</Em> attributes. This can be a useful (though sometimes risky) short-cut.</Par>
			<Par>When we encounter missing references in a join, there are four ways to deal with this.</Par>
			<List items={[
				<>In the <Term>inner join</Term> (the default method) we ignore (remove) any rows from either table that does not have a matching row from the other table.</>,
				<>In the <Term>left (outer) join</Term> we <Em>always</Em> keep the rows from the left table.</>,
				<>In the <Term>right (outer) join</Term> we <Em>always</Em> keep the rows from the right table.</>,
				<>In the <Term>full (outer) join</Term> we <Em>always</Em> keep the rows from <Em>both</Em> tables.</>,
			]} />
			<Par>Any potential missing values are given the value <ISQL>NULL</ISQL> in the joined table.</Par>
			<Info>When we are talking about a "join", we usually talk about the non-natural inner join.</Info>
		</Section>
	</Page>
}

function FigureJoinAndDecomposition() {
	return <MeasuredDrawingFigure
		targets={['table1', 'table2', 'table3']}
		calculateView={({ table2, table3 }) => ({ type: 'identity', width: 1025, height: 140 + table2.height + table3.height + 60 })}
		maxWidth={1000} style={{ fontSize: 16 }}>
		<FigureJoinAndDecompositionContents />
	</MeasuredDrawingFigure>
}

function FigureJoinAndDecompositionContents() {
	const themeColor = useThemeColor()

	// Get the data.
	const db = useTheoryPageDatabase()
	const query1 = 'SELECT * FROM products'
	const data1 = useQueryResult(db, query1)
	const data2 = useQueryResult(db, 'SELECT * FROM accounts;')
	const data3 = useQueryResult(db, `SELECT * FROM (${query1}) p JOIN accounts a ON p.owned_by = a.username;`)

	// Set up reference to the table.
	const t1Bounds = useDrawingTargetBounds('table1')
	const t2Bounds = useDrawingTargetBounds('table2')

	const x = 80
	const delta = 20 // The space between the two arrows.
	const y1 = 140
	const y2 = y1 + (t2Bounds?.height ?? 160)
	const y3 = y2 + 60
	const tableScale = 0.7
	const width = x + 1350 * tableScale

	return <>
		<FigureHtml position={[10, 0]} anchor={[-1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of products</span></FigureHtml>
		<FigureHtml target="table1" position={[0, 25]} anchor={[-1, -1]} scale={tableScale} behind>
			<DrawingTable data={data1} width={900} />
		</FigureHtml>

		{t1Bounds ? <>
			<FigureHtml position={[width - 10, y1 - 25]} anchor={[1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of accounts</span></FigureHtml>
			<FigureHtml target="table2" position={[x, y1]} anchor={[-1, -1]} scale={tableScale} behind>
				<DrawingTable data={data2} width={1350} />
			</FigureHtml>

			{t2Bounds ? <>
				<Curve positions={[[width / 2 - delta / 2, y2 + 4], [width / 2 - delta / 2, y3 - 4]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
				<FigureHtml position={[width / 2 - delta / 2 - 6, (y2 + y3) / 2 - 4]} anchor={[1, 0]}><span style={{ fontWeight: 500, fontSize: '0.8em', color: themeColor }}>Join</span></FigureHtml>

				<Curve positions={[[width / 2 + delta / 2, y3 - 4], [width / 2 + delta / 2, y2 + 4]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
				<FigureHtml position={[width / 2 + delta / 2 + 6, (y2 + y3) / 2 + 4]} anchor={[-1, 0]}><span style={{ fontWeight: 500, fontSize: '0.8em', color: themeColor }}>Decomposition</span></FigureHtml>

				<FigureHtml target="table3" position={[0, y3]} anchor={[-1, -1]} scale={0.47}>
					<DrawingTable data={data3} width={width / 0.47} />
				</FigureHtml>
			</> : null}
		</> : null}
	</>
}
