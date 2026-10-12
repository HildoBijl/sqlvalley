import { type ComponentProps, useCallback } from 'react'

import { type DrawingView, type TargetBoundsRecord, MeasuredDrawingFigure, Curve, useDrawingTargetBounds } from '@step-wise/drawing'
import { DataTable, SQLDisplay, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor } from '@/ui'
import { FigureHtml } from '../FigureHtml'
import { useTheoryPageDatabase } from '../useTheoryPageDatabase'

const targets = ['query', 'table'] as const

export function SQLQueryFigure({ query = '', actualQuery = '', below = false, tableWidth = 300, tableScale = 0.8, delta = 20, arrowLength = 60, arrowRadius = 60 }) {
	const calculateView = useCallback(({ query, table }: TargetBoundsRecord<typeof targets>): DrawingView => {
		const { width: we, height: he } = query
		const { width: wt, height: ht } = table
		const arrowBetween = below ? we + arrowRadius * 1.5 > wt : he + arrowRadius * 1.5 > ht
		const gap = arrowBetween ? arrowLength : delta
		// Keep fractional measurement changes from repeatedly resizing the drawing and its tables.
		return { type: 'identity', width: Math.ceil(below ? Math.max(we, wt) : we + gap + wt), height: Math.ceil(below ? he + gap + ht : Math.max(he, ht)) }
	}, [below, arrowLength, arrowRadius, delta])

	return <MeasuredDrawingFigure
		targets={targets}
		calculateView={calculateView}
		style={{ fontSize: 16 }}>
		<SQLQueryFigureContents query={query} actualQuery={actualQuery} below={below} tableWidth={tableWidth} tableScale={tableScale} delta={delta} arrowLength={arrowLength} arrowRadius={arrowRadius} />
	</MeasuredDrawingFigure>
}

function SQLQueryFigureContents({ query, actualQuery, below, tableWidth, tableScale, delta, arrowLength, arrowRadius }: Required<ComponentProps<typeof SQLQueryFigure>>) {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, actualQuery || query)

	// Find the bounds of the respective elements.
	const eBounds = useDrawingTargetBounds('query')
	const tBounds = useDrawingTargetBounds('table')
	const we = eBounds?.width || 100
	const wt = tBounds?.width || 100
	const he = eBounds?.height || 100
	const ht = tBounds?.height || 100

	// Determine the table position.
	const arrowBetween = below ? we + arrowRadius * 1.5 > wt : he + arrowRadius * 1.5 > ht
	const tx = below ? 0 : (we + (arrowBetween ? arrowLength : delta))
	const ty = below ? (he + (arrowBetween ? arrowLength : delta)) : 0

	// Determine the arrow coordinates.
	const arrowPoints = eBounds && tBounds && (arrowBetween ? (
		below
			? [[Math.min(eBounds.midpoint.x, tBounds.midpoint.x), eBounds.bottom + 4], [Math.min(eBounds.midpoint.x, tBounds.midpoint.x), ty - 4]]
			: [[eBounds.right + 4, Math.min(eBounds.midpoint.y, tBounds.midpoint.y)], [tx - 4, Math.min(eBounds.midpoint.y, tBounds.midpoint.y)]]
	) : (
		below
			? [eBounds.middleRight.add([4, 0]), [eBounds.right + arrowRadius, eBounds.midpoint.y], [eBounds.right + arrowRadius, ty - 4]]
			: [eBounds.bottomMiddle.add([0, 4]), [eBounds.midpoint.x, eBounds.bottom + arrowRadius], [tx - 4, eBounds.bottom + arrowRadius]]
	))

	return <>
		<FigureHtml target="query" position={[0, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query}</SQLDisplay>
		</FigureHtml>

		<FigureHtml position={[tx, ty]} anchor={[-1, -1]} scale={tableScale} target="table" behind>
			<DataTable data={data} showPagination={false} compact width={tableWidth / tableScale} />
		</FigureHtml>

		{arrowPoints ? <Curve positions={arrowPoints} stroke={themeColor} strokeWidth={2} smoothing={{ distance: arrowRadius }} endArrow /> : null}
	</>
}
