import { useState } from 'react'
import PushPinIcon from '@mui/icons-material/PushPin'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { useTheme } from '@mui/material'

import { progressColors } from '../progress/index.ts'

import { planningColors } from './colors.ts'

interface ModulePlanningIndicatorProps {
	variant: 'set' | 'active' | 'next-step'
	iconSize: number
	onActivate?: () => void
}

export function ModulePlanningIndicator({ variant, iconSize, onActivate }: ModulePlanningIndicatorProps) {
	const theme = useTheme()
	const [isPinHovered, setIsPinHovered] = useState(false)

	// Set up the style for the pin circle.
	const containerStyle: React.CSSProperties = {
		position: 'absolute',
		top: -15,
		right: -15,
		width: 2 * iconSize,
		height: 2 * iconSize,
		backgroundColor: theme.palette.background.paper,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		pointerEvents: 'auto',
	}

	// When this is the next step, show a play arrow.
	if (variant === 'next-step') {
		return <div style={{ ...containerStyle, border: '1px solid', color: progressColors.ready }}>
			<PlayArrow style={{ fontSize: iconSize, color: progressColors.ready }} />
		</div>
	}

	// Determine colors for the icon and its border.
	const isActive = variant === 'active'
	const neutralColor = theme.palette.text.disabled
	const iconColor = theme.palette.text.secondary
	const containerBorderColor = isActive ? isPinHovered ? iconColor : planningColors.goal : isPinHovered ? planningColors.goal : iconColor
	const pinIconColor = isActive ? isPinHovered ? neutralColor : planningColors.goal : isPinHovered ? planningColors.goal : neutralColor

	// Render the pin icon.
	return <div
		onClick={event => {
			event.preventDefault()
			event.stopPropagation()
			if (onActivate) onActivate()
		}}
		onMouseEnter={() => setIsPinHovered(true)}
		onMouseLeave={() => setIsPinHovered(false)}
		style={{ ...containerStyle, border: `1px solid ${containerBorderColor}` }}>
		<PushPinIcon style={{ fontSize: iconSize - 4, color: pinIconColor }} />
	</div>
}
