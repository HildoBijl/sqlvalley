import { type ComponentType, type ReactNode, useCallback } from 'react'
import { Box } from '@mui/material'

import { type DrawingView, type TargetBoundsRecord, MeasuredDrawing, HtmlElement, Curve, useDrawingTargetBounds } from '@step-wise/drawing'
import { DataTable, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor } from '@/ui'
import { RA } from '../notation'
import { useTheoryPageDatabase } from '../useTheoryPageDatabase'

type RAQueryFigureProps = {
	query?: ReactNode
	actualQuery?: string
	below?: boolean
	tableWidth?: number
	tableScale?: number
	delta?: number
	arrowLength?: number
	arrowRadius?: number
	Component?: ComponentType<{ children: ReactNode }>
}

const targets = ['query', 'table'] as const

export function RAQueryFigure({ query = <></>, actualQuery = '', below = false, tableWidth = 300, tableScale = 0.8, delta = 20, arrowLength = 50, arrowRadius = 60, Component = RA }: RAQueryFigureProps) {
	const calculateView = useCallback(({ query, table }: TargetBoundsRecord<typeof targets>): DrawingView => {
		const { width: we, height: he } = query
		const { width: wt, height: ht } = table
		const arrowBetween = below ? we + arrowRadius * 1.5 >= wt && wt + arrowRadius * 1.5 >= we : he + arrowRadius * 1.5 >= ht
		const gap = arrowBetween ? arrowLength : delta
		return { type: 'identity', width: below ? Math.max(we, wt) : we + gap + wt, height: below ? he + gap + ht : Math.max(he, ht) }
	}, [below, arrowLength, arrowRadius, delta])

	return <MeasuredDrawing targets={targets} calculateView={calculateView} style={{ fontSize: 16 }}>
		<RAQueryFigureContents query={query} actualQuery={actualQuery} below={below} tableWidth={tableWidth} tableScale={tableScale} delta={delta} arrowLength={arrowLength} arrowRadius={arrowRadius} Component={Component} />
	</MeasuredDrawing>
}

function RAQueryFigureContents({ query, actualQuery, below, tableWidth, tableScale, delta, arrowLength, arrowRadius, Component }: Required<RAQueryFigureProps>) {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, actualQuery)

	// Find the bounds of the respective elements.
	const eBounds = useDrawingTargetBounds('query')
	const tBounds = useDrawingTargetBounds('table')
	const we = eBounds?.width || 100
	const wt = tBounds?.width || 100
	const he = eBounds?.height || 100
	const ht = tBounds?.height || 100
	let arrowPos, tx = 0, ty = 0, arrowPoints

	// Determine the arrow position: 'between', 'topRight' or 'bottomLeft'.
	if (below) {
		if (we + arrowRadius * 1.5 < wt) arrowPos = 'topRight'
		else if (wt + arrowRadius * 1.5 < we) arrowPos = 'bottomLeft'
		else arrowPos = 'between'
	} else {
		if (he + arrowRadius * 1.5 < ht) arrowPos = 'bottomLeft'
		else arrowPos = 'between'
	}

	if (eBounds && tBounds) {
		// Determine the table position.
		if (below) {
			if (arrowPos === 'between') {
				tx = Math.max(0, (we - wt) / 2)
				ty = he + arrowLength
				const middleX = Math.min(eBounds.midpoint.x, tBounds.midpoint.x)
				arrowPoints = [[middleX, eBounds.top + 4], [middleX, ty - 4]]
			} else if (arrowPos === 'topRight') {
				tx = 0
				ty = he + delta
				const rightX = eBounds.right + arrowRadius
				const middleY = eBounds.midpoint.y
				arrowPoints = [[eBounds.right + 4, middleY], [rightX, middleY], [rightX, ty - 4]]
			} else if (arrowPos === 'bottomLeft') {
				tx = we - wt
				ty = he + delta
				const leftX = tBounds.left - arrowRadius
				const middleY = tBounds.midpoint.y
				arrowPoints = [[leftX, eBounds.top + 4], [leftX, middleY], [tBounds.left - 4, middleY]]
			}
		} else {
			tx = we + (arrowPos === 'between' ? arrowLength : delta)
			ty = 0
			if (arrowPos === 'between') {
				const middleY = Math.min(eBounds.midpoint.y, tBounds.midpoint.y)
				arrowPoints = [[eBounds.right + 4, middleY], [tx - 4, middleY]]
			} else {
				const middleX = eBounds.midpoint.x
				const bottomY = eBounds.top + arrowRadius
				arrowPoints = [[middleX, eBounds.top + 4], [middleX, bottomY], [tx - 4, bottomY]]
			}
		}
	}

	return <>
		<HtmlElement target="query" position={[below && arrowPos === 'between' ? Math.max(0, (wt - we) / 2) : 0, 0]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ width: 'max-content', whiteSpace: 'normal' }}>
			<Component>{query}</Component>
		</HtmlElement>

		<HtmlElement position={[tx, ty]} anchor={[-1, -1]} scale={tableScale} target="table" behind ignoreMouse={false} style={{ whiteSpace: 'normal' }}>
			<Box sx={{ width: tableWidth / tableScale }}>
				<DataTable data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{arrowPoints ? <Curve positions={arrowPoints} stroke={themeColor} strokeWidth={2} smoothing={{ distance: arrowRadius }} endArrow /> : null}
	</>
}
