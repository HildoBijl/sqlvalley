import { useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { progressColors } from './colors'

interface ModuleCompletionIndicatorProps {
	iconSize: number
}

export function ModuleCompletionIndicator({ iconSize }: ModuleCompletionIndicatorProps) {
	const theme = useTheme()
	return <div style={{
		position: 'absolute',
		top: -10,
		right: -5,
		width: iconSize,
		height: iconSize,
		backgroundColor: theme.palette.background.paper,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}}>
		<CheckCircleIcon style={{ fontSize: iconSize, color: progressColors.completed }} />
	</div>
}
