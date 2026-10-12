import type { ReactNode } from 'react'

import { TargetBoundsDrawingFigure } from '@step-wise/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { FigureHtml } from '../FigureHtml'
import { useTheoryPageDatabase } from '../useTheoryPageDatabase'

export function TableQueryFigure({ query = '', title = '', tableWidth = 800, tableScale = 0.8 }: { query?: string, title?: ReactNode, tableWidth?: number, tableScale?: number }) {
	// Get the data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Render the drawing.
	return <TargetBoundsDrawingFigure targets={title ? ['title', 'table'] : ['table']} margin={5} maxWidth={tableWidth * tableScale} style={{ fontSize: 16 }}>
		{title ? <FigureHtml target="title" position={[10, 0]} anchor="bottomLeft"><span style={{ fontWeight: 500, fontSize: '0.8em' }}>{title}</span></FigureHtml> : null}
		<FigureHtml target="table" position={[0, 0]} anchor="topLeft" scale={tableScale}>
			<DataTable data={data} width={tableWidth} showPagination={false} compact />
		</FigureHtml>
	</TargetBoundsDrawingFigure>
}
