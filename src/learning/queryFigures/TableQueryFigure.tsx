import { type ReactNode, useCallback } from 'react'
import { Box } from '@mui/material'

import { type DrawingView, type TargetBoundsRecord, MeasuredDrawing, HtmlElement } from '@step-wise/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { useTheoryPageDatabase } from '../useTheoryPageDatabase'

const targets = ['table'] as const

export function TableQueryFigure({ query = '', title = '', tableWidth = 800, tableScale = 0.8 }: { query?: string, title?: ReactNode, tableWidth?: number, tableScale?: number }) {
	// Get the data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	const ty = title ? 20 : 0
	const calculateView = useCallback(({ table }: TargetBoundsRecord<typeof targets>): DrawingView => ({
		type: 'identity', width: tableWidth, height: ty + table.height,
	}), [tableWidth, ty])

	// Render the drawing.
	return <MeasuredDrawing targets={targets} calculateView={calculateView} maxWidth={tableWidth} style={{ fontSize: 16 }}>
		{title ? <HtmlElement position={[10, -5]} anchor={[-1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>{title}</span></HtmlElement> : null}

		<HtmlElement target="table" position={[0, ty]} anchor={[-1, -1]} scale={tableScale} ignoreMouse={false} style={{ whiteSpace: 'normal' }}>
			<Box sx={{ width: tableWidth / tableScale }}>
				<DataTable data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>
	</MeasuredDrawing>
}
