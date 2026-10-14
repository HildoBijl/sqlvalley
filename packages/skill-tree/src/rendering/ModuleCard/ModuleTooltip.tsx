import { useRef } from 'react'
import { useTheme } from '@mui/material'

import { anchors, HtmlElement } from '@step-wise/drawing'
import { useElementSize } from '@step-wise/react-utils'

import { useSkillTreeData } from '../../core'
import { useExplorer } from '../../explorer'
import { useSkillTreeInteraction } from '../../interaction'
import { cardHeight, cardWidth } from '../../positioning'

// Tooltip settings.
const maxTooltipWidth = 320
const tooltipGap = 10
const arrowSize = 13
const arrowEdgeMargin = 16

type TooltipPlacement = 'below' | 'left' | 'right'

// Show the hovered module's description beside its card.
export function ModuleTooltip() {
	const theme = useTheme()
	const tooltipRef = useRef<HTMLDivElement>(null)
	const tooltipSize = useElementSize(tooltipRef)

	// Find which module is hovered over and determine its properties.
	const { modulePresentation, modulePositioning } = useSkillTreeData()
	const { viewportBounds } = useExplorer()
	const { hoveredModuleId } = useSkillTreeInteraction()
	if (!hoveredModuleId) return null
	const description = modulePresentation[hoveredModuleId]?.description ?? 'No description available'
	const { bounds: drawingBounds, modulePositions } = modulePositioning
	const positionData = modulePositions[hoveredModuleId]
	if (!positionData) throw new Error(`No position was defined for module "${hoveredModuleId}".`)

	// Limit the tooltip to the visible part of the drawing. Explorer overflow is not part of the drawing and cannot contain the tooltip.
	const visibleBounds = {
		minX: Math.max(drawingBounds.min.x, viewportBounds.min.x),
		minY: Math.max(drawingBounds.min.y, viewportBounds.min.y),
		maxX: Math.min(drawingBounds.max.x, viewportBounds.max.x),
		maxY: Math.min(drawingBounds.max.y, viewportBounds.max.y),
	}

	// Prefer the space below the card; otherwise use the roomier horizontal side.
	const position = positionData.pixelPosition
	const visibleWidth = Math.max(0, visibleBounds.maxX - visibleBounds.minX - 2 * tooltipGap)
	const defaultWidth = Math.min(maxTooltipWidth, visibleWidth)
	const tooltipHeight = tooltipSize?.height ?? 0
	const fitsBelow = position.y + cardHeight / 2 + tooltipGap + tooltipHeight <= visibleBounds.maxY
	const spaceLeft = position.x - cardWidth / 2 - tooltipGap - visibleBounds.minX
	const spaceRight = visibleBounds.maxX - position.x - cardWidth / 2 - tooltipGap
	const placement: TooltipPlacement = fitsBelow ? 'below' : spaceRight >= spaceLeft ? 'right' : 'left'
	const tooltipWidth = placement === 'below' ? defaultWidth : Math.min(defaultWidth, Math.max(spaceLeft, spaceRight))
	const halfWidth = tooltipWidth / 2
	const halfHeight = tooltipHeight / 2

	// Keep the tooltip and its arrow within the visible drawing rectangle.
	const tooltipX = placement === 'below'
		? clamp(position.x, visibleBounds.minX + halfWidth, visibleBounds.maxX - halfWidth)
		: position.x + (placement === 'right' ? 1 : -1) * (cardWidth / 2 + tooltipGap)
	const tooltipY = placement === 'below'
		? position.y + cardHeight / 2 + tooltipGap
		: clamp(position.y, visibleBounds.minY + halfHeight, visibleBounds.maxY - halfHeight)
	const horizontalArrowPosition = clamp(halfWidth + position.x - tooltipX, arrowEdgeMargin, tooltipWidth - arrowEdgeMargin)
	const verticalArrowPosition = clamp(halfHeight + position.y - tooltipY, arrowEdgeMargin, tooltipHeight - arrowEdgeMargin)

	// Render the tooltip in drawing coordinates.
	return <HtmlElement
		position={[tooltipX, tooltipY]}
		anchor={placement === 'below' ? anchors.top : placement === 'right' ? anchors.left : anchors.right}>
		<div
			ref={tooltipRef}
			style={{
				position: 'relative',
				width: tooltipWidth,
				visibility: tooltipSize ? 'visible' : 'hidden',
				whiteSpace: 'normal',
				boxSizing: 'border-box',
				border: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
				padding: '8px 12px',
				borderRadius: 4,
				fontSize: 14,
				boxShadow: theme.shadows[4],
				zIndex: 1,
			}}>
			{/* Border arrow. */}
			<div style={{
				position: 'absolute',
				...(placement === 'below' ? { left: horizontalArrowPosition, top: -arrowSize / 2 }
					: placement === 'right' ? { left: -arrowSize / 2, top: verticalArrowPosition }
						: { right: -arrowSize / 2, top: verticalArrowPosition }),
				width: arrowSize,
				height: arrowSize,
				backgroundColor: theme.palette.background.paper,
				borderColor: theme.palette.divider,
				borderStyle: 'solid',
				borderWidth: placement === 'below' ? '1px 0 0 1px' : placement === 'right' ? '0 0 1px 1px' : '1px 1px 0 0',
				transform: placement === 'below' ? 'translateX(-50%) rotate(45deg)' : 'translateY(-50%) rotate(45deg)',
			}} />

			{/* Tooltip contents. */}
			{description}
		</div>
	</HtmlElement>
}

function clamp(value: number, min: number, max: number) {
	if (min > max) return (min + max) / 2
	return Math.max(min, Math.min(value, max))
}
