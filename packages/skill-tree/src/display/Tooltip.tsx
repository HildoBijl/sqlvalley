import { createPortal } from 'react-dom'
import { useTheme } from '@mui/material'

import { usePointerPosition } from '@step-wise/react-utils'

import { useSkillTreeData } from '../core'
import { useSkillTreeInteraction } from '../interaction'

export function Tooltip() {
	const mousePosition = usePointerPosition()
	const theme = useTheme()
	const { modulePresentation } = useSkillTreeData()
	const { hoveredModuleId } = useSkillTreeInteraction()
	const description = hoveredModuleId ? (modulePresentation[hoveredModuleId]?.description ?? 'No description available') : undefined

	if (!description || !mousePosition) return null

	return createPortal(
		<div
			style={{
				position: 'fixed',
				left: mousePosition.x,
				top: mousePosition.y,
				transform: 'translate(12px, 12px)',
				border: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
				padding: '8px 12px',
				borderRadius: '4px',
				fontSize: '14px',
				maxWidth: '300px',
				zIndex: 1000,
				boxShadow: theme.shadows[4],
				pointerEvents: 'none',
			}}>
			{description}
		</div>,
		document.body,
	)
}
