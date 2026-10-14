import { Add, HelpOutline, OutlinedFlag, Refresh, Remove } from '@mui/icons-material'
import { Box, Button, Tooltip } from '@mui/material'

import { useExplorer } from '../explorer'
import { useSkillTreePlanning } from '../planning'
import { treeColors } from '../styles'

interface SkillTreeControlsProps {
	onHelp?: () => void
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
			<Tooltip title="Zoom In" placement="left">
				<Button variant="outlined" size="small" onClick={() => zoomBy(1.2)} sx={{ minWidth: '40px' }}>
					<Add fontSize="small" color="primary" />
				</Button>
			</Tooltip>
			<Tooltip title="Zoom Out" placement="left">
				<Button variant="outlined" size="small" onClick={() => zoomBy(1 / 1.2)} sx={{ minWidth: '40px' }}>
					<Remove fontSize="small" color="primary" />
				</Button>
			</Tooltip>
			<Tooltip title="Reset View" placement="left">
				<Button variant="outlined" size="small" onClick={reset} sx={{ minWidth: '40px', fontSize: '15px' }}>
					<Refresh fontSize="small" color="primary" />
				</Button>
			</Tooltip>
		</>}

		{/* Planning mode flag. */}
		{planningEnabled && <Tooltip title="Planning Mode" placement="left">
			<Button
				variant={planningMode ? 'contained' : 'outlined'}
				size="small"
				onClick={togglePlanningMode}
				sx={{
					minWidth: '40px',
					fontSize: '15px',
					...(planningMode && {
						backgroundColor: treeColors.goal,
						borderColor: treeColors.goal,
						'&:hover': { backgroundColor: treeColors.goalHover },
					}),
				}}>
				<OutlinedFlag fontSize="small" sx={{ color: planningMode ? 'white' : 'primary' }} />
			</Button>
		</Tooltip>}

		{/* Help button. */}
		{onHelp && <Tooltip title="Help" placement="left">
			<Button variant="outlined" size="small" onClick={onHelp} sx={{ minWidth: '40px', fontSize: '15px' }}>
				<HelpOutline fontSize="small" color="primary" />
			</Button>
		</Tooltip>}
	</Box>
}
