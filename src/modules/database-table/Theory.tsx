import type { ComponentProps } from 'react'
import { Box } from '@mui/material'

import { MeasuredDrawing, HtmlElement, Curve, Rectangle } from '@step-wise/drawing'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'
import { DataTable } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Info, Term, Em } from '@/ui'
import { useFigureTarget, useFigureTextBounds, RelationName, useTheoryPageDatabase } from '@/learning'

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

export function FigureTerminology(props: ComponentProps<typeof FigureTerminologyContents>) {
	return <MeasuredDrawing targets={['table']}
		calculateView={({ table }) => ({
			type: 'identity', width: 700,
			height: 60 + table.height,
		})} style={{ fontSize: 16 }}>
		<FigureTerminologyContents {...props} />
	</MeasuredDrawing>
}

function FigureTerminologyContents({ terminology }: { terminology?: { [key: string]: React.ReactNode } }) {
	const themeColor = useThemeColor()

	// Get data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, 'SELECT * FROM departments;')

	// Set up reference to the table.
	const [tRef, tBounds, table] = useFigureTarget('table')

	// Find the text nodes.
	const text = String(data?.values[2]?.[1] ?? '')
	const textNodeBounds = useFigureTextBounds('textNodeBounds', table, text, { index: 0, parentDepth: 2 })
	const columnNameNodeBounds = useFigureTextBounds('columnNameNodeBounds', table, 'd_id', { index: 0, parentDepth: 3 })

	// Define coordinates.
	const x = 180
	const y = 60
	const w = 700
	const r = 12
	const scale = 0.8

	// Render the drawing.
	return <>
		{/* Table. */}
		<HtmlElement position={[x, y]} anchor={[-1, -1]} scale={scale} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: (w - x) / scale }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{tBounds && textNodeBounds && columnNameNodeBounds ? <>
			{/* Table marker. */}
			<HtmlElement position={[x + (w - x) / 2, y - 38]} anchor={[0, 1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ color: themeColor, fontWeight: 500, fontSize: '0.8em' }}>{terminology?.table}</span></HtmlElement>
			<Curve positions={[[x, y - 40 + r], [x, y - 40], [w, y - 40], [w, y - 40 + r]]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Contents marker. */}
			<HtmlElement position={[x - 80, (columnNameNodeBounds.top + tBounds.top) / 2]} anchor={[1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ color: themeColor, fontWeight: 500, fontSize: '0.8em' }}>{terminology?.contents}</span></HtmlElement>
			<Curve positions={[[x - 75 + r, columnNameNodeBounds.top + 2], [x - 75, columnNameNodeBounds.top + 2], [x - 75, tBounds.top], [x - 75 + r, tBounds.top]]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Column marker. */}
			<HtmlElement position={[textNodeBounds.midpoint.x, y - 12]} anchor={[0, 1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ color: themeColor, fontWeight: 500, fontSize: '0.8em' }}>{terminology?.column}</span></HtmlElement>
			<Curve positions={[[textNodeBounds.left, y - 13 + r], [textNodeBounds.left, y - 13], [textNodeBounds.right, y - 13], [textNodeBounds.right, y - 13 + r]]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Column names marker. */}
			<HtmlElement position={[x - 25, columnNameNodeBounds.midpoint.y - 3]} anchor={[1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ color: themeColor, fontWeight: 500, fontSize: '0.8em' }}>{terminology?.columnNames}</span></HtmlElement>
			<Curve positions={[[x - 20 + r, columnNameNodeBounds.bottom], [x - 20, columnNameNodeBounds.bottom], [x - 20, columnNameNodeBounds.top], [x - 20 + r, columnNameNodeBounds.top]]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Row marker. */}
			<HtmlElement position={[x - 25, textNodeBounds.midpoint.y]} anchor={[1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ color: themeColor, fontWeight: 500, fontSize: '0.8em' }}>{terminology?.row}</span></HtmlElement>
			<Curve positions={[[x - 20 + r, textNodeBounds.bottom], [x - 20, textNodeBounds.bottom], [x - 20, textNodeBounds.top], [x - 20 + r, textNodeBounds.top]]} smoothing={{ distance: r }} stroke={themeColor} strokeWidth={2} />

			{/* Cell marker. */}
			<HtmlElement position={textNodeBounds.bottomRight.add([-8, 3])} anchor={[1, 1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ color: themeColor, fontWeight: 500, fontSize: '0.8em' }}>{terminology?.cell}</span></HtmlElement>
			<Rectangle corners={[textNodeBounds.min, textNodeBounds.max]} cornerRadius={r} style={{ stroke: themeColor, strokeWidth: 2, fill: 'none' }} />
		</> : null}
	</>
}
