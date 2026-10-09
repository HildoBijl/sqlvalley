import type { ReactNode } from 'react'

import { TargetBoundsDrawing, HtmlElement } from '@step-wise/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { useTheoryPageDatabase } from '../useTheoryPageDatabase'

export function TableQueryFigure({ query = '', title = '', tableWidth = 800, tableScale = 0.8 }: { query?: string, title?: ReactNode, tableWidth?: number, tableScale?: number }) {
	// Get the data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Render the drawing.
	return <TargetBoundsDrawing targets={title ? ['title', 'table'] : ['table']} margin={5} maxWidth={tableWidth * tableScale} style={{ fontSize: 16 }}>
		{title ? <HtmlElement target="title" position={[10, 0]} anchor="bottomLeft"><span style={{ fontWeight: 500, fontSize: '0.8em' }}>{title}</span></HtmlElement> : null}
		<HtmlElement target="table" position={[0, 0]} anchor="topLeft" scale={tableScale} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<DataTable data={data} width={tableWidth} showPagination={false} compact />
		</HtmlElement>
	</TargetBoundsDrawing>
}
