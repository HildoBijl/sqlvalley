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
const tooltipViewportPadding = 20
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
	const position = positionData.pixelPosition

	// Calculate the size of the tooltip. For small screens, limit its width.
	const visibleWidth = Math.max(0, viewportBounds.max.x - viewportBounds.min.x - 2 * tooltipGap)
	const defaultWidth = Math.min(maxTooltipWidth, visibleWidth)
	const tooltipHeight = tooltipSize?.height ?? 0

	// Determine where to place the tooltip based on available space. Possibly adjust its width if needed.
	const fitsBelow = position.y + cardHeight / 2 + tooltipGap + tooltipHeight <= Math.min(drawingBounds.max.y, viewportBounds.max.y)
	const spaceLeft = position.x - cardWidth / 2 - tooltipGap - viewportBounds.min.x
	const spaceRight = viewportBounds.max.x - position.x - cardWidth / 2 - tooltipGap
	const placement: TooltipPlacement = fitsBelow ? 'below' : spaceRight >= spaceLeft ? 'right' : 'left'
	const tooltipWidth = placement === 'below' ? defaultWidth : Math.min(defaultWidth, Math.max(0, spaceLeft, spaceRight))

	// Try to keep the tooltip within the viewport, but never let it pass beyond the ModuleCard's edge.
	const tooltipX = placement === 'below'
		? clamp(position.x,
			Math.min(position.x - cardWidth / 2, viewportBounds.min.x + tooltipViewportPadding) + tooltipWidth / 2,
			Math.max(position.x + cardWidth / 2, viewportBounds.max.x - tooltipViewportPadding) - tooltipWidth / 2)
		: position.x + (placement === 'right' ? 1 : -1) * (cardWidth / 2 + tooltipGap)
	const tooltipY = placement === 'below'
		? position.y + cardHeight / 2 + tooltipGap
		: clamp(position.y, drawingBounds.min.y + tooltipHeight / 2, drawingBounds.max.y - tooltipHeight / 2)
	const horizontalArrowPosition = clamp(tooltipWidth / 2 + position.x - tooltipX, arrowEdgeMargin, tooltipWidth - arrowEdgeMargin)
	const verticalArrowPosition = clamp(tooltipHeight / 2 + position.y - tooltipY, arrowEdgeMargin, tooltipHeight - arrowEdgeMargin)

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
