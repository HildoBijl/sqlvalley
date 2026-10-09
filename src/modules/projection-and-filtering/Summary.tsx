import { Box } from '@mui/material'

import { MeasuredDrawing, HtmlElement, Line } from '@step-wise/drawing'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'
import { DataTable } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, Term } from '@/ui'
import { useFigureTarget, useTheoryPageDatabase } from '@/learning'

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
	return <MeasuredDrawing targets={['table1', 'table2', 'table3']}
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

	const [t1Ref, t1Bounds] = useFigureTarget('table1')
	const [t2Ref, t2Bounds] = useFigureTarget('table2')
	const [t3Ref] = useFigureTarget('table3')
	const w1 = 600
	const w2 = 120
	const w3 = 340
	const arrowMargin = 10
	const arrowHeight = 80
	const h1 = Math.max(t1Bounds?.height || 200, t2Bounds?.height || 200)

	return <>
		<HtmlElement position={[0, 0]} anchor={[-1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: w1 }}>
				<DataTable ref={t1Ref} data={dataFull} showPagination={false} compact />
			</Box>
		</HtmlElement>

		<HtmlElement position={[w1 + w2, 0]} anchor={[-1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: w3 }}>
				<DataTable ref={t2Ref} data={dataProjection} showPagination={false} compact />
			</Box>
		</HtmlElement>

		<HtmlElement position={[0, h1 + arrowHeight]} anchor={[-1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: w1 }}>
				<DataTable ref={t3Ref} data={dataFiltering} showPagination={false} compact />
			</Box>
		</HtmlElement>

		<Line positions={[[w1 + arrowMargin, h1 / 2], [w1 + w2 - arrowMargin, h1 / 2]]} stroke={themeColor} endArrow strokeWidth={2} />
		<HtmlElement position={[w1 + w2 / 2 - 3, h1 / 2]} anchor={[0, 1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 500, fontSize: '1em' }}>Projection</span></HtmlElement>

		<Line positions={[[w1 / 2, h1 + arrowMargin], [w1 / 2, h1 + arrowHeight - arrowMargin]]} stroke={themeColor} endArrow strokeWidth={2} />
		<HtmlElement position={[w1 / 2 + 6, h1 + arrowHeight / 2 - 4]} anchor={[-1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 500, fontSize: '1em' }}>Filtering: <code style={{ marginLeft: '4px' }}>nr_employees &gt; 10</code></span></HtmlElement>
	</>
}
