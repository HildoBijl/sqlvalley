import { MeasuredDrawingFigure, Line, useDrawingTargetBounds } from '@step-wise/drawing'
import { DrawingTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Term, Info } from '@/ui'
import { FigureHtml, useTheoryPageDatabase } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know that databases have various tables, each with their own columns and rows. When analyzing the data, we often perform <Term>table manipulation operations</Term>: we turn the table into a new table that is in some way different. Let's check out some common operations.</Par>
		</Section>

		<Section title="Projection: choosing columns">
			<Par>Suppose that we have a table and we are only interested in a few of the columns. For instance, we have a list of product sales within our platform and only want to know who tried to sell something and for how much. In that case, we can choose to use those columns and throw out the rest. This operation is called <Term>projection</Term>.</Par>
			<FigureProjection />
			<Info>When we apply projection (or any other operation), we always set up a new table with the requested data. The original data is never modified.</Info>
		</Section>

		<Section title="Filtering: choosing rows">
			<Par>Alternatively, we may only need a subset of the rows. For example, we want to find all transactions larger than a million dollars. In that case, we apply <Term>filtering</Term>: we set up a <Term>condition</Term> (price more than a million) and only keep the rows matching this filtering condition.</Par>
			<FigureFiltering />
		</Section>

		<Section title="Other table manipulation operations">
			<Par>Projection and filtering are the most important table manipulation operations. Other examples of operations include:</Par>
			<List items={[
				<>Renaming a column: adjusting its name.</>,
				<>Copying a column and adding it to the table.</>,
				<>Applying an operation to all values in a column. Think of doubling all the numbers, or similar.</>,
			]} />
			<Par>And there are many more possible table manipulation operations.</Par>
		</Section>
	</Page>
}

function FigureProjection() {
	return <MeasuredDrawingFigure
		targets={['table1', 'table2']}
		calculateView={({ table1, table2 }) => ({ type: 'identity', width: 1260, height: Math.max(table1.height, table2.height) })} maxWidth={848} style={{ fontSize: 16 }}>
		<FigureProjectionContents />
	</MeasuredDrawingFigure>
}

function FigureProjectionContents() {
	const themeColor = useThemeColor()
	const db = useTheoryPageDatabase()
	const dataFull = useQueryResult(db, 'SELECT * FROM transactions;')
	const dataProjection = useQueryResult(db, 'SELECT vendor, price FROM transactions;')

	const t1Bounds = useDrawingTargetBounds('table1')
	const t2Bounds = useDrawingTargetBounds('table2')
	const height = Math.max(t1Bounds?.height || 200, t2Bounds?.height || 200)
	const w1 = 900
	const w2 = 120
	const w3 = 240
	const arrowMargin = 10

	return <>
		<FigureHtml target="table1" position={[0, 0]} anchor={[-1, -1]}>
			<DrawingTable data={dataFull} width={w1} />
		</FigureHtml>

		<FigureHtml target="table2" position={[w1 + w2, 0]} anchor={[-1, -1]}>
			<DrawingTable data={dataProjection} width={w3} />
		</FigureHtml>

		<Line positions={[[w1 + arrowMargin, height / 2], [w1 + w2 - arrowMargin, height / 2]]} stroke={themeColor} endArrow strokeWidth={2} />
		<FigureHtml position={[w1 + w2 / 2 - 3, height / 2]} anchor={[0, 1]}><span style={{ fontWeight: 500, fontSize: '1em' }}>Projection</span></FigureHtml>
	</>
}

function FigureFiltering() {
	return <MeasuredDrawingFigure
		targets={['table1', 'table2']}
		calculateView={({ table1, table2 }) => ({ type: 'identity', width: 900, height: table1.height + 80 + table2.height })} maxWidth={640} style={{ fontSize: 16 }}>
		<FigureFilteringContents />
	</MeasuredDrawingFigure>
}

function FigureFilteringContents() {
	const themeColor = useThemeColor()
	const db = useTheoryPageDatabase()
	const dataFull = useQueryResult(db, 'SELECT * FROM transactions;')
	const dataFiltering = useQueryResult(db, 'SELECT * FROM transactions WHERE price > 1000000;')

	const t1Bounds = useDrawingTargetBounds('table1')

	const w = 900
	const arrowHeight = 80
	const arrowMargin = 10
	const h1 = t1Bounds?.height ?? 200

	return <>
		<FigureHtml target="table1" position={[0, 0]} anchor={[-1, -1]}>
			<DrawingTable data={dataFull} width={w} />
		</FigureHtml>

		<FigureHtml target="table2" position={[0, h1 + arrowHeight]} anchor={[-1, -1]}>
			<DrawingTable data={dataFiltering} width={w} />
		</FigureHtml>

		<Line positions={[[w / 2, h1 + arrowMargin], [w / 2, h1 + arrowHeight - arrowMargin]]} stroke={themeColor} endArrow strokeWidth={2} />
		<FigureHtml position={[w / 2 + 6, h1 + arrowHeight / 2 - 4]} anchor={[-1, 0]}>
			<span style={{ fontWeight: 500, fontSize: '1em' }}>Filtering: <code style={{ marginLeft: '4px' }}>price &gt; 1000000</code></span>
		</FigureHtml>
	</>
}
