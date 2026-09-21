import { Button } from '@mui/material'
import { Lightbulb } from '@mui/icons-material'

import { useExerciseManager } from '@sqlvalley/exercise-manager'

import { useMonoExerciseControls } from './controlsContext'

export function ShowSolutionButton() {
	const { pending } = useExerciseManager()
	const { showSolution } = useMonoExerciseControls()
	return <Button size="small" variant="outlined" startIcon={<Lightbulb />} disabled={pending || !showSolution} onClick={showSolution}>
		Show Solution
	</Button>
}
