import { Box } from '@mui/material'

import { MeasuredDrawing, HtmlElement, Curve } from '@step-wise/drawing'
import { Vector } from '@step-wise/geometry'
import { SQLDisplay, DataTable } from '@sqlvalley/sql'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'

import { useThemeColor, Page, Section, Par } from '@/ui'
import { useFigureTarget, useFigureTextBounds, useTheoryPageDatabase } from '@/learning'

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
	return <MeasuredDrawing targets={['query', 'table1', 'table2']}
		calculateView={({ query, table1, table2 }) => ({
			type: 'identity', width: 700,
			height: query.height + table1.height + table2.height + 40,
		})} style={{ fontSize: 16 }}>
		<FigureSortingContents />
	</MeasuredDrawing>
}

function FigureSortingContents() {
	const themeColor = useThemeColor()

	// Set up data for the two tables.
	const db = useTheoryPageDatabase()
	const data1 = useQueryResult(db, 'SELECT * FROM departments')
	const data2 = useQueryResult(db, query)

	// Obtain bounds of elements.
	const [eRef, eBounds, editor] = useFigureTarget('query')
	const [t1Ref, t1Bounds] = useFigureTarget('table1')
	const [t2Ref, t2Bounds] = useFigureTarget('table2')

	// Extract heights.
	const editorHeight = eBounds?.height ?? 200
	const t1Height = t1Bounds?.height ?? 400

	// Find bounds of query parts.
	const ascBounds = useFigureTextBounds('ascBounds', editor, 'ASC')
	const descBounds = useFigureTextBounds('descBounds', editor, 'DESC')
	const limitBounds = useFigureTextBounds('limitBounds', editor, 'LIMIT')
	const offsetBounds = useFigureTextBounds('offsetBounds', editor, ';')

	// Define position data.
	const offset = 28 // Between text lines.
	const b1 = new Vector([350, 36])
	const b2 = new Vector([b1.x, b1.y + offset])
	const b3 = new Vector([b2.x, b2.y + offset])
	const b4 = new Vector([b3.x, b3.y + offset])

	// Render the figure.
	return <>
		{/* Query */}
		<HtmlElement ref={eRef} position={[40, 0]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		{/* Explainer text */}
		<HtmlElement position={b1} anchor={[-1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ textWrap: 'nowrap' }}>Sort ascending by number of employees,</span></HtmlElement>
		<HtmlElement position={b2} anchor={[-1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ textWrap: 'nowrap' }}>and on equality, sort descending by budget.</span></HtmlElement>
		<HtmlElement position={b3} anchor={[-1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ textWrap: 'nowrap' }}>Then only pick the first three rows,</span></HtmlElement>
		<HtmlElement position={b4} anchor={[-1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ textWrap: 'nowrap' }}>after having skipped the first row.</span></HtmlElement>

		{eBounds ? <>
			{/* Arrows to explainer text */}
			{ascBounds && <Curve positions={[ascBounds.middleRight.add([9, 1]), ascBounds.middleRight.add([28, 1]), b1.add([-22, 0]), b1.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}
			{descBounds && <Curve positions={[descBounds.middleRight.add([3, 1]), descBounds.middleRight.add([62, 1]), b2.add([-22, 0]), b2.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}
			{limitBounds && <Curve positions={[limitBounds.middleRight.add([22, 1]), limitBounds.middleRight.add([123, 1]), b3.add([-22, 0]), b3.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}
			{offsetBounds && <Curve positions={[offsetBounds.middleRight.add([5, 1]), offsetBounds.middleRight.add([123, 1]), b4.add([-22, 0]), b4.add([-4, 0])]} endArrow={true} stroke={themeColor} strokeWidth={2} smoothing={{ ratio: 1 }} />}

			{/* Table 1 */}
			<HtmlElement position={[0, editorHeight + 20]} anchor={[-1, -1]} scale={0.7} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
				<Box sx={{ width: 460 / 0.75 }}>
					<DataTable ref={t1Ref} data={data1} showPagination={false} compact />
				</Box>
			</HtmlElement>

			{t1Bounds ? <>
				{/* Table 2. */}
				<HtmlElement position={[700, editorHeight + 20 + t1Height + 20]} anchor={[1, -1]} scale={0.7} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
					<Box sx={{ width: 460 / 0.75 }}>
						<DataTable ref={t2Ref} data={data2} showPagination={false} compact />
					</Box>
				</HtmlElement>

				{/* Arrow between tables */}
				{t2Bounds ? <>
					<Curve positions={[[(t1Bounds.left + t2Bounds.left) / 2, t1Bounds.top + 10], [(t1Bounds.left + t2Bounds.left) / 2, t2Bounds.midpoint.y], t2Bounds.middleLeft.add([-10, 0])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
				</> : null}
			</> : null}
		</> : null}
	</>
}
