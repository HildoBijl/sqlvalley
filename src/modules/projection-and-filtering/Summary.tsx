import { MeasuredDrawing, Line, useDrawingTargetBounds } from '@step-wise/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, Term } from '@/ui'
import { FigureHtml, useTheoryPageDatabase } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>We can execute a <Term>table manipulation operation</Term> on a database table: an action that turns an existing table into a new one. The most common operations are <Term>projection</Term> (choosing a subset of the columns) and <Term>filtering</Term> (choosing a subset of the rows, based on a given condition).</Par>
			<FigureProjectionAndFiltering />
			<Par>Other operations include renaming columns, copying columns, and applying an operation to all the values in a column.</Par>
		</Section>
	</Page>
}

function FigureProjectionAndFiltering() {
	return <MeasuredDrawing
		targets={['table1', 'table2', 'table3']}
		calculateView={({ table1, table2, table3 }) => ({
			type: 'identity', width: 1060,
			height: Math.max(table1.height, table2.height) + 80 + table3.height,
		})} maxWidth={848} style={{ fontSize: 16 }}>
		<FigureProjectionAndFilteringContents />
	</MeasuredDrawing>
}

function FigureProjectionAndFilteringContents() {
	const themeColor = useThemeColor()
	const db = useTheoryPageDatabase()
	const dataFull = useQueryResult(db, 'SELECT * FROM departments;')
	const dataProjection = useQueryResult(db, 'SELECT d_name, nr_employees FROM departments;')
	const dataFiltering = useQueryResult(db, 'SELECT * FROM departments WHERE nr_employees > 10;')

	const t1Bounds = useDrawingTargetBounds('table1')
	const t2Bounds = useDrawingTargetBounds('table2')

	const w1 = 600
	const w2 = 120
	const w3 = 340
	const arrowMargin = 10
	const arrowHeight = 80
	const h1 = Math.max(t1Bounds?.height || 200, t2Bounds?.height || 200)

	return <>
		<FigureHtml target="table1" position={[0, 0]} anchor={[-1, -1]}>
			<DataTable data={dataFull} showPagination={false} compact width={w1} />
		</FigureHtml>

		<FigureHtml target="table2" position={[w1 + w2, 0]} anchor={[-1, -1]}>
			<DataTable data={dataProjection} showPagination={false} compact width={w3} />
		</FigureHtml>

		<FigureHtml target="table3" position={[0, h1 + arrowHeight]} anchor={[-1, -1]}>
			<DataTable data={dataFiltering} showPagination={false} compact width={w1} />
		</FigureHtml>

		<Line positions={[[w1 + arrowMargin, h1 / 2], [w1 + w2 - arrowMargin, h1 / 2]]} stroke={themeColor} endArrow strokeWidth={2} />
		<FigureHtml position={[w1 + w2 / 2 - 3, h1 / 2]} anchor={[0, 1]}><span style={{ fontWeight: 500, fontSize: '1em' }}>Projection</span></FigureHtml>

		<Line positions={[[w1 / 2, h1 + arrowMargin], [w1 / 2, h1 + arrowHeight - arrowMargin]]} stroke={themeColor} endArrow strokeWidth={2} />
		<FigureHtml position={[w1 / 2 + 6, h1 + arrowHeight / 2 - 4]} anchor={[-1, 0]}><span style={{ fontWeight: 500, fontSize: '1em' }}>Filtering: <code style={{ marginLeft: '4px' }}>nr_employees &gt; 10</code></span></FigureHtml>
	</>
}
