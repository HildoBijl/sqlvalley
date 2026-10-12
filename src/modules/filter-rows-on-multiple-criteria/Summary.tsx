import { MeasuredDrawing, Curve, useDrawingTextTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { DataTable, ISQL, SQLDisplay, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Info, Term, Em } from '@/ui'
import { FigureHtml, useTheoryPageDatabase } from '@/learning'
import { FigureMergingTables } from './Theory'

export function Summary() {
	return <Page>
		<Section>
			<Par>If we want to filter rows based on multiple conditions, we can combine them using <ISQL>AND</ISQL>, <ISQL>OR</ISQL> and <ISQL>NOT</ISQL>.</Par>
			<FigureCombinedCondition />
			<Info>When evaluating the conditions, SQL always first resolves the comparisons, turning them into <ISQL>TRUE</ISQL>/<ISQL>FALSE</ISQL>. Then it applies any potential <ISQL>NOT</ISQL> operators. At the end it resolves <ISQL>AND</ISQL>/<ISQL>OR</ISQL>. Brackets can be used to indicate a different operation order.</Info>
			<Par>A very different (and less common) way of applying multiple conditions is by <Term>merging</Term> two query results with the <Em>same number of columns</Em>. Columns are matched by position, not by name; other DBMSs may also require compatible column types.</Par>
			<List items={[
				<>The <ISQL>UNION</ISQL> command gathers all rows present in <Em>at least one</Em> of the two tables (like an <ISQL>OR</ISQL>).</>,
				<>The <ISQL>INTERSECT</ISQL> command gathers all rows present in <Em>both</Em> tables (like an <ISQL>AND</ISQL>).</>,
				<>The <ISQL>EXCEPT</ISQL> command gathers all rows present in the first table but <Em>not</Em> in the second table (like a subtraction).</>,
			]} />
			<FigureMergingTables query1={`SELECT *
FROM contracts
WHERE status = 'sick leave'`} query2={`SELECT *
FROM contracts
WHERE position = 'transportation supervisor'`} operator="UNION" />
		</Section>
	</Page>
}

function FigureCombinedCondition() {
	return <MeasuredDrawing
		targets={['query', 'table']}
		calculateView={({ query, table }) => ({
			type: 'identity', width: 800,
			height: query.height + 30 + table.height,
		})}
		style={{ fontSize: 16 }}>
		<FigureCombinedConditionContents />
	</MeasuredDrawing>
}

function FigureCombinedConditionContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const query = `
SELECT *
FROM contracts
WHERE NOT (status = 'paid leave' OR status = 'sick leave')
  AND start_date < '2023-01-01';`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the editor bounds.
	const eBounds = useDrawingTargetBounds('query')
	useDrawingTextTarget('c1QueryBounds', 'query', 'sick leave')
	const c1QueryBounds = useDrawingTargetBounds('c1QueryBounds')
	useDrawingTextTarget('c2QueryBounds', 'query', 'start_date')
	const c2QueryBounds = useDrawingTargetBounds('c2QueryBounds')

	// Find the table column name bounds.

	useDrawingTextTarget('c1NameBounds', 'table', 'status')
	const c1NameBounds = useDrawingTargetBounds('c1NameBounds')
	useDrawingTextTarget('c2NameBounds', 'table', 'start_date')
	const c2NameBounds = useDrawingTargetBounds('c2NameBounds')

	const delta = 30

	return <>
		<FigureHtml target="query" position={[0, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query}</SQLDisplay>
		</FigureHtml>

		{eBounds ? <FigureHtml target="table" position={[0, eBounds.height + delta]} anchor={[-1, -1]} scale={0.8} behind>
			<DataTable data={data} showPagination={false} compact width={800 / 0.8} />
		</FigureHtml> : null}

		{eBounds && c1QueryBounds && c1NameBounds && c2QueryBounds && c2NameBounds ? <>
			<Curve positions={[c1QueryBounds.middleRight.add([9, 2]), [c1NameBounds.midpoint.x, c1QueryBounds.midpoint.y + 2], c1NameBounds.topMiddle.add([0, -4])]} stroke={themeColor} smoothing={{ distance: 60 }} endArrow strokeWidth={2} />
			<Curve positions={[[c2QueryBounds.midpoint.x + 4, c2QueryBounds.bottom + 2], [c2QueryBounds.midpoint.x + 4, eBounds.bottom + delta / 2 - 2], [c2NameBounds.midpoint.x, eBounds.bottom + delta / 2 - 2], c2NameBounds.topMiddle]} stroke={themeColor} smoothing={{ distance: 20 }} endArrow strokeWidth={2} />
		</> : null}
	</>
}
