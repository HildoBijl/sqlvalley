import { MeasuredDrawingFigure, Curve, useDrawingTextTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { Vector } from '@step-wise/geometry'
import { SQLDisplay, DrawingTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par } from '@/ui'
import { FigureHtml, useTheoryPageDatabase } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>To sort rows in tables, and/or limit the number of given rows, there is a variety of options we can add to the end of an SQL query.</Par>
			<FigureSorting />
		</Section>
	</Page>
}

const query = `
SELECT *
FROM departments
ORDER BY
  nr_employees ASC,
  budget DESC
LIMIT 3
OFFSET 1;`

function FigureSorting() {
	return <MeasuredDrawingFigure
		targets={['query', 'table1', 'table2']}
		calculateView={({ query, table1, table2 }) => ({ type: 'identity', width: 700, height: query.height + table1.height + table2.height + 40 })}
		style={{ fontSize: 16 }}>
		<FigureSortingContents />
	</MeasuredDrawingFigure>
}

function FigureSortingContents() {
	const themeColor = useThemeColor()

	// Set up data for the two tables.
	const db = useTheoryPageDatabase()
	const data1 = useQueryResult(db, 'SELECT * FROM departments')
	const data2 = useQueryResult(db, query)

	// Obtain bounds of elements.
	const eBounds = useDrawingTargetBounds('query')
	const t1Bounds = useDrawingTargetBounds('table1')
	const t2Bounds = useDrawingTargetBounds('table2')

	// Extract heights.
	const editorHeight = eBounds?.height ?? 200
	const t1Height = t1Bounds?.height ?? 400

	// Find bounds of query parts.
	useDrawingTextTarget('ascBounds', 'query', 'ASC')
	const ascBounds = useDrawingTargetBounds('ascBounds')
	useDrawingTextTarget('descBounds', 'query', 'DESC')
	const descBounds = useDrawingTargetBounds('descBounds')
	useDrawingTextTarget('limitBounds', 'query', 'LIMIT')
	const limitBounds = useDrawingTargetBounds('limitBounds')
	useDrawingTextTarget('offsetBounds', 'query', ';')
	const offsetBounds = useDrawingTargetBounds('offsetBounds')

	// Define position data.
	const offset = 28 // Between text lines.
	const b1 = new Vector([350, 36])
	const b2 = new Vector([b1.x, b1.y + offset])
	const b3 = new Vector([b2.x, b2.y + offset])
	const b4 = new Vector([b3.x, b3.y + offset])

	// Render the figure.
	return <>
		{/* Query */}
		<FigureHtml target="query" position={[40, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query}</SQLDisplay>
		</FigureHtml>

		{/* Explainer text */}
		<FigureHtml position={b1} anchor={[-1, 0]}><span style={{ textWrap: 'nowrap' }}>Sort ascending by number of employees,</span></FigureHtml>
		<FigureHtml position={b2} anchor={[-1, 0]}><span style={{ textWrap: 'nowrap' }}>and on equality, sort descending by budget.</span></FigureHtml>
		<FigureHtml position={b3} anchor={[-1, 0]}><span style={{ textWrap: 'nowrap' }}>Then only pick the first three rows,</span></FigureHtml>
		<FigureHtml position={b4} anchor={[-1, 0]}><span style={{ textWrap: 'nowrap' }}>after having skipped the first row.</span></FigureHtml>

		{eBounds ? <>
			{/* Arrows to explainer text */}
			{ascBounds && <Curve positions={[ascBounds.middleRight.add([9, 1]), ascBounds.middleRight.add([28, 1]), b1.add([-22, 0]), b1.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}
			{descBounds && <Curve positions={[descBounds.middleRight.add([3, 1]), descBounds.middleRight.add([62, 1]), b2.add([-22, 0]), b2.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}
			{limitBounds && <Curve positions={[limitBounds.middleRight.add([22, 1]), limitBounds.middleRight.add([123, 1]), b3.add([-22, 0]), b3.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}
			{offsetBounds && <Curve positions={[offsetBounds.middleRight.add([5, 1]), offsetBounds.middleRight.add([123, 1]), b4.add([-22, 0]), b4.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}

			{/* Table 1 */}
			<FigureHtml target="table1" position={[0, editorHeight + 20]} anchor={[-1, -1]} scale={0.7}>
				<DrawingTable data={data1} width={460 / 0.75} />
			</FigureHtml>

			{t1Bounds ? <>
				{/* Table 2. */}
				<FigureHtml target="table2" position={[700, editorHeight + 20 + t1Height + 20]} anchor={[1, -1]} scale={0.7}>
					<DrawingTable data={data2} width={460 / 0.75} />
				</FigureHtml>

				{/* Arrow between tables */}
				{t2Bounds ? <>
					<Curve positions={[[(t1Bounds.left + t2Bounds.left) / 2, t1Bounds.bottom + 10], [(t1Bounds.left + t2Bounds.left) / 2, t2Bounds.midpoint.y], t2Bounds.middleLeft.add([-10, 0])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
				</> : null}
			</> : null}
		</> : null}
	</>
}
