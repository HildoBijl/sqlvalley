import { Button } from '@mui/material'
import { Lightbulb } from '@mui/icons-material'

import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { useInputExerciseContext } from '../inputExercise'

export function ShowSolutionButton() {
	const { submitting } = useExerciseSessionContext()
	const { insertSolution } = useInputExerciseContext()
	return <Button size="small" variant="outlined" startIcon={<Lightbulb />} disabled={submitting || !insertSolution} onClick={insertSolution}>
		Show Solution
	</Button>
}
