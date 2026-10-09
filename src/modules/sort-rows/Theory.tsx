import { Box } from '@mui/material'

import { MeasuredDrawing, HtmlElement, Curve } from '@step-wise/drawing'
import { Vector } from '@step-wise/geometry'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'
import { DataTable, ISQL, SQLDisplay } from '@sqlvalley/sql'

import { useThemeColor, Page, Par, Section, Warning, Term, Em } from '@/ui'
import { useFigureTarget, useFigureTextBounds, useTheoryPageDatabase } from '@/learning'

export function Theory() {
	return <Page>
		<Par>We know how to use SQL to retrieve an entire table. The rows usually appear in the order in which they have originally been added. If we want a different order, we can <Term>sort</Term> the table. Let's check out how this works.</Par>

		<Section title="Sort on a single column">
			<Par>To sort the output, we add an <ISQL>ORDER BY</ISQL> clause to the end of the query and specify the column to sort by. Optionally, we can add <ISQL>ASC</ISQL> (ascending, default) or <ISQL>DESC</ISQL> (descending) to choose the sorting direction.</Par>
			<FigureSortOnSingleColumn />
			<Par>The exact sorting method depends on the <Term>data type</Term>. For numbers, we sort by magnitude. For text, we sort lexicographically (in dictionary order). For dates/times, we sort by which date/time is earlier or later.</Par>
		</Section>

		<Section title="Sort based on multiple columns">
			<Par>When the first column contains sorting ties, then we can add additional sorting attributes separated by commas. Only when the first attribute is equal, will SQL compare the second attribute to determine the order. And then a third attribute, if given, and so forth.</Par>
			<FigureSortOnMultipleColumns />
		</Section>

		<Section title="Limit the number of rows">
			<Par>To limit the number of rows that are returned, we add a <ISQL>LIMIT</ISQL> clause, followed by how many rows we want to be returned. Only the <Em>first</Em> couple of rows will be returned.</Par>
			<FigureLimitRows />
			<Par>We can combine <ISQL>LIMIT</ISQL> with <ISQL>OFFSET</ISQL> to skip a number of rows before returning results.</Par>
			<FigureLimitRowsWithOffset />
			<Warning>Most database management systems support <ISQL>LIMIT</ISQL> and <ISQL>OFFSET</ISQL>, but a few use alternative keywords. If these clauses do not work in your DBMS, check its documentation for the required syntax.</Warning>
		</Section>

		<Section title="Deal with NULL values">
			<Par>When sorting, <ISQL>NULL</ISQL> values either come at the start or at the end. About half of the DBMSs (including SQLite) treat <ISQL>NULL</ISQL> values as the <Em>smallest</Em> possible value: it comes first on ascending order and last on descending order. The other half of the DBMSs have it the other way around, and treat <ISQL>NULL</ISQL> values as the <Em>largest</Em> possible value. If you want to flip this default behavior, you can override it using <ISQL>NULLS FIRST</ISQL> or <ISQL>NULLS LAST</ISQL>, specified per sorting attribute.</Par>
			<FigureSortNullValues />
		</Section>
	</Page>
}

function FigureSortOnSingleColumn() {
	return <MeasuredDrawing targets={['table']}
		calculateView={({ table }) => ({
			type: 'identity', width: 800,
			height: 20 + table.height,
		})} style={{ fontSize: 16 }}>
		<FigureSortOnSingleColumnContents />
	</MeasuredDrawing>
}

function FigureSortOnSingleColumnContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const sortColumn = 'd_name'
	const query = `
SELECT *
FROM departments
ORDER BY ${sortColumn} DESC;`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the bounds for "DESC".
	const [eRef, , editor] = useFigureTarget('query')
	const descBounds = useFigureTextBounds('descBounds', editor, 'DESC')

	// Find the bounds for "d_name".
	const [tRef, tBounds, table] = useFigureTarget('table')
	const sortColumnNameBounds = useFigureTextBounds('sortColumnNameBounds', table, sortColumn)

	return <>
		<HtmlElement ref={eRef} position={[0, 20]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		<HtmlElement position={[320, 20]} anchor={[-1, -1]} scale={0.6} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 800 }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{descBounds && sortColumnNameBounds ? <Curve positions={[descBounds.bottomRight.add([0, 0]), [descBounds.right + 70, 0], [sortColumnNameBounds.left - 30, 0], sortColumnNameBounds.topLeft.add([-12, 8])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
		{sortColumnNameBounds && tBounds ? <Curve positions={[[sortColumnNameBounds.left - 10, tBounds.top - 6], sortColumnNameBounds.topLeft.add([-10, 12])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
	</>
}

function FigureSortOnMultipleColumns() {
	return <MeasuredDrawing targets={['table']}
		calculateView={({ table }) => ({
			type: 'identity', width: 800,
			height: 40 + table.height,
		})} style={{ fontSize: 16 }}>
		<FigureSortOnMultipleColumnsContents />
	</MeasuredDrawing>
}

function FigureSortOnMultipleColumnsContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const sortColumn1 = 'nr_employees'
	const sortColumn2 = 'budget'
	const query = `SELECT *
FROM departments
ORDER BY
  ${sortColumn1} ASC,
  ${sortColumn2} DESC;`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the bounds for "DESC".
	const [eRef, , editor] = useFigureTarget('query')
	const ascBounds = useFigureTextBounds('ascBounds', editor, 'ASC')
	const descBounds = useFigureTextBounds('descBounds', editor, 'DESC')

	// Find the bounds for "d_name".
	const [tRef, tBounds, table] = useFigureTarget('table')
	const sortColumn1NameBounds = useFigureTextBounds('sortColumn1NameBounds', table, sortColumn1)
	const sortColumn2NameBounds = useFigureTextBounds('sortColumn2NameBounds', table, sortColumn2)

	const drawingHeight = 20 + (tBounds?.height ?? 200) + 20
	return <>
		{/* SQL query */}
		<HtmlElement ref={eRef} position={[0, 20]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		{/* Table */}
		<HtmlElement position={[320, 20]} anchor={[-1, -1]} scale={0.6} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 800 }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{/* First sorting arrows */}
		{ascBounds && sortColumn1NameBounds && tBounds ? <>
			<HtmlElement position={sortColumn1NameBounds.bottomLeft.add([-36, -6])} anchor={[-1, 1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 600, color: themeColor, fontSize: '0.7rem' }}>Primary sorting</span></HtmlElement>
			<Curve positions={[ascBounds.bottomRight.add([0, 0]), [ascBounds.right + 70, 0], [sortColumn1NameBounds.left - 30, 0], sortColumn1NameBounds.topLeft.add([-16, 8])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
			<Curve positions={[sortColumn1NameBounds.topLeft.add([-14, 12]), [sortColumn1NameBounds.left - 14, tBounds.top - 6]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
		</> : null}

		{/* Second sorting arrows */}
		{descBounds && sortColumn2NameBounds && tBounds ? <>
			<HtmlElement position={[sortColumn2NameBounds.left - 34, drawingHeight - 16]} anchor={[-1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 600, color: themeColor, fontSize: '0.7rem', opacity: 0.5 }}>Secondary sorting</span></HtmlElement>
			<Curve positions={[descBounds.topRight.add([0, 3]), [descBounds.right + 120, drawingHeight], [sortColumn2NameBounds.left - 40, drawingHeight], [sortColumn2NameBounds.left - 14, drawingHeight - 24]]} stroke={themeColor} endArrow style={{ opacity: 0.5 }} strokeWidth={2} smoothing={{ ratio: 1 }} />
			<Curve positions={[[sortColumn2NameBounds.left - 12, tBounds.top - 6], sortColumn2NameBounds.topLeft.add([-12, 12])]} stroke={themeColor} endArrow style={{ opacity: 0.5 }} strokeWidth={2} smoothing={{ ratio: 1 }} />
		</> : null}
	</>
}

function FigureLimitRows() {
	return <MeasuredDrawing targets={['table', 'query']}
		calculateView={({ table, query }) => ({
			type: 'identity', width: 800,
			height: Math.max(table.height, query.height),
		})} style={{ fontSize: 16 }}>
		<FigureLimitRowsContents />
	</MeasuredDrawing>
}

function FigureLimitRowsContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const sortColumn = 'd_name'
	const query = `
SELECT *
FROM departments
ORDER BY ${sortColumn} DESC
LIMIT 3;`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the bounds for "DESC".
	const [eRef, , editor] = useFigureTarget('query')
	const limitBounds = useFigureTextBounds('limitBounds', editor, ';')

	// Find the bounds for "d_name".
	const [tRef, tBounds, table] = useFigureTarget('table')
	const sortColumnNameBounds = useFigureTextBounds('sortColumnNameBounds', table, sortColumn)

	const minY = (sortColumnNameBounds?.top ?? 60) + 12
	const maxY = (tBounds?.top ?? 200) - 6
	const avgY = (minY + maxY) / 2
	const x = (tBounds?.left ?? 320) - 10
	return <>
		<HtmlElement ref={eRef} position={[0, 0]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		<HtmlElement position={[320, 0]} anchor={[-1, -1]} scale={0.6} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 800 }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{limitBounds && sortColumnNameBounds ? <Curve positions={[limitBounds.middleRight.add([2, 2]), limitBounds.middleRight.add([70, 2]), [x - 30, avgY], [x - 8, avgY]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}

		{sortColumnNameBounds && tBounds ? <Curve positions={[[x, minY], [x, maxY]]} stroke={themeColor} startArrow endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
	</>
}

function FigureLimitRowsWithOffset() {
	return <MeasuredDrawing targets={['table', 'query']}
		calculateView={({ table, query }) => ({
			type: 'identity', width: 800,
			height: Math.max(table.height, query.height),
		})} style={{ fontSize: 16 }}>
		<FigureLimitRowsWithOffsetContents />
	</MeasuredDrawing>
}

function FigureLimitRowsWithOffsetContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const sortColumn = 'd_name'
	const offset = 1
	const query = `
SELECT *
FROM departments
ORDER BY ${sortColumn} DESC
LIMIT 3 OFFSET ${offset};`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the bounds for "DESC".
	const [eRef, , editor] = useFigureTarget('query')
	const offsetBounds = useFigureTextBounds('offsetBounds', editor, ';')

	// Find the bounds for "d_name".
	const [tRef, tBounds, table] = useFigureTarget('table')
	const sortColumnNameBounds = useFigureTextBounds('sortColumnNameBounds', table, sortColumn)

	const point = tBounds && sortColumnNameBounds && new Vector(tBounds.left - 4, sortColumnNameBounds.top + 10)
	return <>
		<HtmlElement ref={eRef} position={[0, 0]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		<HtmlElement position={[320, 0]} anchor={[-1, -1]} scale={0.6} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 800 }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{point ? <HtmlElement position={point} anchor={[1, 0]} scale={0.6} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<span style={{ color: themeColor, fontWeight: 600 }}>+{offset}</span>
		</HtmlElement> : null}

		{offsetBounds && point ? <Curve positions={[offsetBounds.middleRight.add([2, 2]), offsetBounds.middleRight.add([70, 2]), point.add([-40, 0]), point.add([-14, 0])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
	</>
}

function FigureSortNullValues() {
	return <MeasuredDrawing targets={['table']}
		calculateView={({ table }) => ({
			type: 'identity', width: 800,
			height: 20 + table.height,
		})} style={{ fontSize: 16 }}>
		<FigureSortNullValuesContents />
	</MeasuredDrawing>
}

function FigureSortNullValuesContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const sortColumn = 'budget'
	const query = `
SELECT *
FROM departments
ORDER BY ${sortColumn} ASC NULLS LAST;`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the bounds for "DESC".
	const [eRef, , editor] = useFigureTarget('query')
	const descBounds = useFigureTextBounds('descBounds', editor, 'DESC')

	// Find the bounds for "d_name".
	const [tRef, tBounds, table] = useFigureTarget('table')
	const sortColumnNameBounds = useFigureTextBounds('sortColumnNameBounds', table, sortColumn)

	return <>
		<HtmlElement ref={eRef} position={[0, 20]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		<HtmlElement position={[320, 20]} anchor={[-1, -1]} scale={0.6} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 800 }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{descBounds && sortColumnNameBounds ? <Curve positions={[descBounds.bottomRight.add([0, 0]), [descBounds.right + 70, 0], [sortColumnNameBounds.left - 30, 0], sortColumnNameBounds.topLeft.add([-12, 8])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
		{sortColumnNameBounds && tBounds ? <Curve positions={[sortColumnNameBounds.topLeft.add([-10, 12]), [sortColumnNameBounds.left - 10, tBounds.top - 6]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
	</>
}
