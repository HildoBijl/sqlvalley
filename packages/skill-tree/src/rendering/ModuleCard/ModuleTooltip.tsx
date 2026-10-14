import { useTheme } from '@mui/material'

import { anchors, HtmlElement } from '@step-wise/drawing'

import { useSkillTreeData } from '../../core'
import { useSkillTreeInteraction } from '../../interaction'
import { cardHeight } from '../../positioning'

// Tooltip settings.
const maxTooltipWidth = 320
const tooltipGap = 10
const arrowSize = 13
const arrowEdgeMargin = 16

// Show the hovered module's description beside its card.
export function ModuleTooltip() {
	const theme = useTheme()

	// Find which module is hovered over and determine its properties.
	const { modulePresentation, modulePositioning } = useSkillTreeData()
	const { hoveredModuleId } = useSkillTreeInteraction()
	if (!hoveredModuleId) return null
	const description = modulePresentation[hoveredModuleId]?.description ?? 'No description available'
	const positionData = modulePositioning.modulePositions[hoveredModuleId]
	if (!positionData) throw new Error(`No position was defined for module "${hoveredModuleId}".`)

	// Determine where to place the tooltip horizontally.
	const { bounds } = modulePositioning
	const tooltipWidth = Math.min(maxTooltipWidth, bounds.width)
	const halfTooltipWidth = tooltipWidth / 2
	const minTooltipX = bounds.min.x + halfTooltipWidth
	const maxTooltipX = bounds.max.x - halfTooltipWidth
	const tooltipX = minTooltipX <= maxTooltipX ? Math.max(minTooltipX, Math.min(positionData.pixelPosition.x, maxTooltipX)) : bounds.midpoint.x

	// Determine where to place the tooltip vertically.
	const spaceAbove = positionData.pixelPosition.y - cardHeight / 2 - bounds.min.y
	const spaceBelow = bounds.max.y - positionData.pixelPosition.y - cardHeight / 2
	const showAbove = spaceAbove > spaceBelow
	const tooltipY = positionData.pixelPosition.y + (showAbove ? -1 : 1) * (cardHeight / 2 + tooltipGap)
	const arrowPosition = Math.max(arrowEdgeMargin, Math.min(halfTooltipWidth + positionData.pixelPosition.x - tooltipX, tooltipWidth - arrowEdgeMargin))

	// Render the tooltip.
	return <HtmlElement
		position={[tooltipX, tooltipY]}
		anchor={showAbove ? anchors.bottom : anchors.top}
		style={{
			width: tooltipWidth,
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
			left: arrowPosition,
			...(showAbove ? { bottom: -arrowSize / 2 } : { top: -arrowSize / 2 }),
			width: arrowSize,
			height: arrowSize,
			backgroundColor: theme.palette.background.paper,
			borderColor: theme.palette.divider,
			borderStyle: 'solid',
			borderWidth: showAbove ? '0 1px 1px 0' : '1px 0 0 1px',
			transform: 'translateX(-50%) rotate(45deg)',
		}} />

		{/* Tooltip contents. */}
		{description}
	</HtmlElement>
}
