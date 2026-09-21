import { Typography } from '@mui/material'

interface ExerciseDescriptionProps {
	description?: string
	tableNames?: string[]
}

export function ExerciseDescription({ description, tableNames }: ExerciseDescriptionProps) {
	if (!description) {
		return null
	}

	return (
		<>
			<Typography variant="body1">{description}</Typography>
			{tableNames && tableNames.length > 0 && (
				<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
					Available tables: {tableNames.join(', ')}
				</Typography>
			)}
		</>
	)
}
