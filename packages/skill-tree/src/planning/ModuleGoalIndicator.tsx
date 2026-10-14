import { useState } from 'react'
import PushPinIcon from '@mui/icons-material/PushPin'
import { PlayArrow } from '@mui/icons-material'
import { useTheme } from '@mui/material'

import { treeColors } from '../styles'

interface ModuleGoalIndicatorProps {
	variant: 'set' | 'active' | 'next-step'
	iconSize: number
	onSetGoal?: () => void
}

export function ModuleGoalIndicator({ variant, iconSize, onSetGoal }: ModuleGoalIndicatorProps) {
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
		return <div style={{ ...containerStyle, border: '1px solid', color: treeColors.ready }}>
			<PlayArrow style={{ fontSize: iconSize, color: treeColors.ready }} />
		</div>
	}

	// Determine colors for the icon and its border.
	const isActive = variant === 'active'
	const containerBorderColor = isActive ? isPinHovered ? treeColors.icon : treeColors.goal : isPinHovered ? treeColors.goal : treeColors.icon
	const pinIconColor = isActive ? isPinHovered ? treeColors.neutral : treeColors.goal : isPinHovered ? treeColors.goal : treeColors.neutral

	// Render the pin icon.
	return <div
		onClick={event => {
			event.preventDefault()
			event.stopPropagation()
			if (onSetGoal) onSetGoal()
		}}
		onMouseEnter={() => setIsPinHovered(true)}
		onMouseLeave={() => setIsPinHovered(false)}
		style={{ ...containerStyle, border: `1px solid ${containerBorderColor}` }}>
		<PushPinIcon style={{ fontSize: iconSize - 4, color: pinIconColor }} />
	</div>
}
