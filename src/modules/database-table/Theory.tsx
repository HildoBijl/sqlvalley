import type { ReactNode } from 'react'

import { TargetBoundsDrawing, HtmlElement, Curve, Rectangle, useDrawingElementTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Info, Term, Em } from '@/ui'
import { RelationName, useTheoryPageDatabase } from '@/learning'

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
		<HtmlElement target="table" position={[0, 0]} anchor="topLeft" scale={0.8} behind>
			<DataTable data={data} width={650} showPagination={false} compact />
		</HtmlElement>

		{table && header && cell ? <>
			{/* Table marker. */}
			<HtmlElement target="tableLabel" position={[table.midpoint.x, table.min.y - 38]} anchor="bottom"><span style={labelStyle}>{terminology?.table}</span></HtmlElement>
			<Curve positions={[
				table.min.add([0, -40 + r]),
				table.min.add([0, -40]),
				[table.max.x, table.min.y - 40],
				[table.max.x, table.min.y - 40 + r],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Contents marker. */}
			<HtmlElement target="contentsLabel" position={[table.min.x - 80, (header.max.y + table.max.y) / 2 + 1]} anchor="right"><span style={labelStyle}>{terminology?.contents}</span></HtmlElement>
			<Curve positions={[
				[table.min.x - 75 + r, header.max.y + 2],
				[table.min.x - 75, header.max.y + 2],
				[table.min.x - 75, table.max.y],
				[table.min.x - 75 + r, table.max.y],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Column marker. */}
			<HtmlElement target="columnLabel" position={[cell.midpoint.x, table.min.y - 12]} anchor="bottom"><span style={labelStyle}>{terminology?.column}</span></HtmlElement>
			<Curve positions={[
				[cell.min.x, table.min.y - 13 + r],
				[cell.min.x, table.min.y - 13],
				[cell.max.x, table.min.y - 13],
				[cell.max.x, table.min.y - 13 + r],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Column names marker. */}
			<HtmlElement target="columnNamesLabel" position={[table.min.x - 25, header.midpoint.y - 3]} anchor="right"><span style={labelStyle}>{terminology?.columnNames}</span></HtmlElement>
			<Curve positions={[
				[table.min.x - 20 + r, header.min.y],
				[table.min.x - 20, header.min.y],
				[table.min.x - 20, header.max.y],
				[table.min.x - 20 + r, header.max.y],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Row marker. */}
			<HtmlElement target="rowLabel" position={[table.min.x - 25, cell.midpoint.y]} anchor="right"><span style={labelStyle}>{terminology?.row}</span></HtmlElement>
			<Curve positions={[
				[table.min.x - 20 + r, cell.min.y],
				[table.min.x - 20, cell.min.y],
				[table.min.x - 20, cell.max.y],
				[table.min.x - 20 + r, cell.max.y],
			]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Cell marker. */}
			<HtmlElement target="cellLabel" position={[cell.max.x - 8, cell.min.y + 2]} anchor="bottomRight"><span style={labelStyle}>{terminology?.cell}</span></HtmlElement>
			<Rectangle corners={[cell.min, cell.max]} cornerRadius={r} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} />
		</> : null}
	</>
}
