import type { ReactElement } from 'react'
import { Add, HelpOutline, OutlinedFlag, Refresh, Remove } from '@mui/icons-material'
import { Box, Button, Fade, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { useExplorer } from '../explorer'
import { planningColors, useSkillTreePlanning } from '../planning'

interface SkillTreeControlsProps {
	onHelp?: () => void
}

interface ControlTooltipProps {
	title: string
	children: ReactElement
}

// Combine controls supplied by the explorer and optional skill-tree features.
export function SkillTreeControls({ onHelp }: SkillTreeControlsProps) {
	const { allowZoom, zoomBy, reset } = useExplorer()
	const { planningEnabled, planningMode, togglePlanningMode } = useSkillTreePlanning()

	// On no zoom, planning mode, or help, don't render control buttons.
	if (!allowZoom && !planningEnabled && !onHelp) return null

	// Render the control buttons.
	return <Box sx={{
		position: 'absolute',
		top: 16,
		right: 16,
		zIndex: 1000,
		display: 'flex',
		flexDirection: 'column',
		gap: 1,
		backgroundColor: 'background.paper',
		borderRadius: 2,
		p: 1,
	}}>
		{/* Zoom buttons. */}
		{allowZoom && <>
			<ControlTooltip title="Zoom In">
				<Button variant="outlined" size="small" onClick={() => zoomBy(1.2)} sx={{ minWidth: '40px' }}>
					<Add fontSize="small" color="primary" />
				</Button>
			</ControlTooltip>
			<ControlTooltip title="Zoom Out">
				<Button variant="outlined" size="small" onClick={() => zoomBy(1 / 1.2)} sx={{ minWidth: '40px' }}>
					<Remove fontSize="small" color="primary" />
				</Button>
			</ControlTooltip>
			<ControlTooltip title="Reset View">
				<Button variant="outlined" size="small" onClick={reset} sx={{ minWidth: '40px', fontSize: '15px' }}>
					<Refresh fontSize="small" color="primary" />
				</Button>
			</ControlTooltip>
		</>}

		{/* Planning mode flag. */}
		{planningEnabled && <ControlTooltip title="Planning Mode">
			<Button
				variant={planningMode ? 'contained' : 'outlined'}
				size="small"
				onClick={togglePlanningMode}
				sx={{
					minWidth: '40px',
					fontSize: '15px',
					...(planningMode && {
						backgroundColor: planningColors.goal,
						borderColor: planningColors.goal,
						'&:hover': { backgroundColor: planningColors.goalHover },
					}),
				}}>
				<OutlinedFlag fontSize="small" sx={{ color: planningMode ? 'white' : 'primary' }} />
			</Button>
		</ControlTooltip>}

		{/* Help button. */}
		{onHelp && <ControlTooltip title="Help">
			<Button variant="outlined" size="small" onClick={onHelp} sx={{ minWidth: '40px', fontSize: '15px' }}>
				<HelpOutline fontSize="small" color="primary" />
			</Button>
		</ControlTooltip>}
	</Box>
}

function ControlTooltip({ title, children }: ControlTooltipProps) {
	return <Tooltip
		title={title}
		placement="left"
		slots={{ transition: Fade }}
		slotProps={{
			tooltip: {
				sx: theme => ({
					position: 'relative',
					marginRight: '7px !important',
					'&::after': {
						content: '""',
						position: 'absolute',
						top: '50%',
						right: -4,
						transform: 'translateY(-50%)',
						borderTop: '5px solid transparent',
						borderBottom: '5px solid transparent',
						borderLeft: `5px solid ${alpha(theme.palette.grey[700], 0.92)}`,
					},
				}),
			},
		}}>
		{children}
	</Tooltip>
}
