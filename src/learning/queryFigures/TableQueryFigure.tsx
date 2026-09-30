import type { ReactNode } from 'react'
import { Box } from '@mui/material'

import { type DrawingData, useRefWithValue, Drawing, Element, useRefWithBounds } from '@sqlvalley/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { useTheoryPageDatabase } from '../useTheoryPageDatabase'

export function TableQueryFigure({ query = '', title = '', tableWidth = 800, tableScale = 0.8 }: { query?: string, title?: ReactNode, tableWidth?: number, tableScale?: number }) {
	// Get the data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Check out the table bounds.
	const [drawingRef, drawingData] = useRefWithValue<DrawingData>()
	const [tRef, tBounds] = useRefWithBounds(drawingData)
	const ty = (title ? 20 : 0)
	const height = ty + (tBounds?.height || 200)

	// Render the drawing.
	return <Drawing ref={drawingRef} width={tableWidth} height={height} maxWidth={tableWidth}>
		{title ? <Element position={[10, -5]} anchor={[-1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>{title}</span></Element> : null}

		<Element position={[0, ty]} anchor={[-1, -1]} scale={tableScale}>
			<Box sx={{ width: tableWidth / tableScale }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</Element>
	</Drawing>
}
