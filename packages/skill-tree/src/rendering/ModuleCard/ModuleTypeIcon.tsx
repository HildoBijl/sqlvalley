import School from '@mui/icons-material/School'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useTheme } from '@mui/material'

interface ModuleTypeIconProps {
	type: 'concept' | 'skill'
	iconSize: number
}

export function ModuleTypeIcon({ type, iconSize }: ModuleTypeIconProps) {
	const theme = useTheme()
	return <div style={{
		position: 'absolute',
		top: -10,
		left: -5,
		width: iconSize,
		height: iconSize,
		backgroundColor: theme.palette.background.paper,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}}>
		{type === 'concept' ?
			<School style={{ fontSize: iconSize, color: theme.palette.text.secondary }} /> :
			<EditNoteIcon style={{ fontSize: iconSize, color: theme.palette.text.secondary }} />}
	</div>
}
