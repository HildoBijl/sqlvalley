import type { ReactNode } from 'react'

import { TargetBoundsDrawing, Curve, Rectangle, useDrawingElementTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Info, Term, Em } from '@/ui'
import { FigureHtml, RelationName, useTheoryPageDatabase } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know that a database is basically a collection of tables. Let's study one such table. What parts does it have and, more importantly, what do we call these parts?</Par>
		</Section>

		<Section title="Basic table terminology">
			<Par>When talking about database tables, we often use the terminology you are probably already familiar with. A <Term>table</Term> has various <Term>columns</Term>, each having a unique <Term>column name</Term>. The <Term>table contents</Term> consists of any number of <Term>rows</Term>, where each row consists of one <Term>cell</Term> for each column. Each cell contains a <Term>value</Term>.</Par>
			<FigureTerminology terminology={{
				table: 'Table',
				contents: 'Contents',
				column: 'Column',
				columnNames: 'Column names',
				row: 'Row',
				cell: 'Cell',
			}} />
			<Info>In database tables columns have names, but rows do not. They don't even have an index or ID. Of course you <Em>can</Em> set up a column named "ID" or similar. This is actually common practice.</Info>
			<Par>The set-up/design of the table is called the <Term>schema</Term>. It consists of the table name and the names of its columns. A common way of writing the schema is by putting the table name in bold, and the attributes behind it within brackets. (Though variations to this convention occur.) For the above example table we have the schema: <List items={[<><RelationName>departments</RelationName> (d_id, d_name, manager_id, budget, nr_employees)</>]} /></Par>
		</Section>

		<Section title="Rows as objects">
			<Par>In database tables, a table row often represents some kind of real-life object. When this is the case, another set of terminology is often used. Columns are called <Term>properties</Term> or <Term>attributes</Term>, and they have a <Term>property name</Term>. Rows represents <Term>records</Term>, and they have various <Term>fields</Term>/<Term>property values</Term>.</Par>
			<FigureTerminology terminology={{
				table: 'Table',
				contents: 'Records',
				column: 'Property/Attribute',
				columnNames: 'Property/Attribute names',
				row: 'Record',
				cell: 'Field',
			}} />
		</Section>

		<Section title="Mathematical analysis of databases">
			<Par>When mathematicians analyse databases, they view tables from the viewpoint of set theory. In this case, a fully different terminology is used. A table (its design/set-up) is known as a <Term>relation</Term>, with the table contents being the <Term>relation instance</Term>. A column is an <Term>attribute</Term> and a single row is a <Term>tuple</Term> containing various <Term>values</Term>.</Par>
			<FigureTerminology terminology={{
				table: 'Relation',
				contents: 'Relation instance',
				column: 'Attribute',
				columnNames: 'Attribute names',
				row: 'Tuple',
				cell: 'Value',
			}} />
			<Info>As you see, the field of databases has different branches. Every subfield has its own local language. On SQL Valley, we use whatever terminology is most appropriate for the respective topic.</Info>
		</Section>
	</Page>
}

type Terminology = Partial<Record<'table' | 'contents' | 'column' | 'columnNames' | 'row' | 'cell', ReactNode>>

export function FigureTerminology({ terminology }: { terminology?: Terminology }) {
	return <TargetBoundsDrawing targets={['table', 'tableLabel', 'contentsLabel', 'columnLabel', 'columnNamesLabel', 'rowLabel', 'cellLabel']} margin={5} maxWidth={700} style={{ fontSize: 16 }}>
		<FigureTerminologyContents terminology={terminology} />
	</TargetBoundsDrawing>
}

function FigureTerminologyContents({ terminology }: { terminology?: Terminology }) {
	const themeColor = useThemeColor()

	// Get data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, 'SELECT * FROM departments;')

	// Define targets within the drawing that will be measured.
	useDrawingElementTarget('cell', 'table', table => table.querySelector('[data-id="2"] [data-field="column_1"]'))
	useDrawingElementTarget('header', 'table', table => table.querySelector('[role="columnheader"]'))

	// Read bounds in drawing coordinates.
	const table = useDrawingTargetBounds('table')
	const header = useDrawingTargetBounds('header')
	const cell = useDrawingTargetBounds('cell')

	// Define annotation positions and styling.
	const r = 12
	const labelStyle = { color: themeColor, fontWeight: 500, fontSize: '0.8em' }

	// Render the drawing.
	return <>
		{/* Table. */}
		<FigureHtml target="table" position={[0, 0]} anchor="topLeft" scale={0.8} behind>
			<DataTable data={data} width={650} showPagination={false} compact />
		</FigureHtml>

		{table && header && cell ? <>
			{/* Table marker. */}
			<FigureHtml target="tableLabel" position={[table.midpoint.x, table.top - 38]} anchor="bottom"><span style={labelStyle}>{terminology?.table}</span></FigureHtml>
			<Curve positions={[
				table.topLeft.add([0, -40 + r]),
				table.topLeft.add([0, -40]),
				[table.right, table.top - 40],
				[table.right, table.top - 40 + r],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Contents marker. */}
			<FigureHtml target="contentsLabel" position={[table.left - 80, (header.bottom + table.bottom) / 2 + 1]} anchor="right"><span style={labelStyle}>{terminology?.contents}</span></FigureHtml>
			<Curve positions={[
				[table.left - 75 + r, header.bottom + 2],
				[table.left - 75, header.bottom + 2],
				[table.left - 75, table.bottom],
				[table.left - 75 + r, table.bottom],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Column marker. */}
			<FigureHtml target="columnLabel" position={[cell.midpoint.x, table.top - 12]} anchor="bottom"><span style={labelStyle}>{terminology?.column}</span></FigureHtml>
			<Curve positions={[
				[cell.left, table.top - 13 + r],
				[cell.left, table.top - 13],
				[cell.right, table.top - 13],
				[cell.right, table.top - 13 + r],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Column names marker. */}
			<FigureHtml target="columnNamesLabel" position={[table.left - 25, header.midpoint.y - 3]} anchor="right"><span style={labelStyle}>{terminology?.columnNames}</span></FigureHtml>
			<Curve positions={[
				[table.left - 20 + r, header.top],
				[table.left - 20, header.top],
				[table.left - 20, header.bottom],
				[table.left - 20 + r, header.bottom],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Row marker. */}
			<FigureHtml target="rowLabel" position={[table.left - 25, cell.midpoint.y]} anchor="right"><span style={labelStyle}>{terminology?.row}</span></FigureHtml>
			<Curve positions={[
				[table.left - 20 + r, cell.top],
				[table.left - 20, cell.top],
				[table.left - 20, cell.bottom],
				[table.left - 20 + r, cell.bottom],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Cell marker. */}
			<FigureHtml target="cellLabel" position={[cell.right - 8, cell.top + 2]} anchor="bottomRight"><span style={labelStyle}>{terminology?.cell}</span></FigureHtml>
			<Rectangle corners={[cell.topLeft, cell.bottomRight]} cornerRadius={r} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} />
		</> : null}
	</>
}
