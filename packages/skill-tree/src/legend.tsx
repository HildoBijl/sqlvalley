import { Close, EditNote, School } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { type StateHandle, useControllableState } from '@step-wise/react-utils'

export interface SkillTreeLegendStateHandles {
	hidden?: StateHandle<boolean>
}

interface TreeLegendProps {
	stateHandles?: SkillTreeLegendStateHandles
}

// Display a legend for the skill-tree nodes.
export function TreeLegend({ stateHandles }: TreeLegendProps) {
	const [hidden, setHidden] = useControllableState(stateHandles?.hidden, false)
	if (hidden) return null

	return <Box sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 2 }}>
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: 1,
			p: 2,
			border: theme => `1px solid ${theme.palette.divider}`,
			backgroundColor: 'background.paper',
			borderRadius: 2,
		}}>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography variant="subtitle2" fontWeight={600}>Legend</Typography>
				<IconButton
					size="small"
					onClick={() => setHidden(true)}
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						opacity: 0.6,
						'&:hover': { opacity: 1, color: 'red' },
						ml: 1,
						p: 0.25,
					}}>
					<Close fontSize="small" />
				</IconButton>
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Box sx={{ width: 40, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<School fontSize="small" color="action" />
				</Box>
				<Typography variant="body2">Concept</Typography>
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Box sx={{ width: 40, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<EditNote fontSize="small" color="action" />
				</Box>
				<Typography variant="body2">Skill</Typography>
			</Box>
		</Box>
	</Box>
}
