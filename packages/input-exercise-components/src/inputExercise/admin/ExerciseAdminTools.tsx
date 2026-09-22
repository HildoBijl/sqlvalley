import { Box } from '@mui/material'

import { useExerciseSessionContext, ExerciseSelection } from '@sqlvalley/exercise-manager'

import { ShowSolutionButton } from './ShowSolutionButton'

export function ExerciseAdminTools() {
	const { admin } = useExerciseSessionContext()
	if (!admin.showControls) return null
	return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
		<ExerciseSelection />
		<ShowSolutionButton />
	</Box>
}
