import { Button } from '@mui/material'
import { Lightbulb } from '@mui/icons-material'

import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { useMonoExerciseControls } from './controlsContext'

export function ShowSolutionButton() {
	const { submitting } = useExerciseSessionContext()
	const { showSolution } = useMonoExerciseControls()
	return <Button size="small" variant="outlined" startIcon={<Lightbulb />} disabled={submitting || !showSolution} onClick={showSolution}>
		Show Solution
	</Button>
}
