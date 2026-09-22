import { Button } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'

import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

export interface NextExerciseButtonProps {
	disabled?: boolean
}

export function NextExerciseButton({ disabled = false }: NextExerciseButtonProps) {
	const { submitting, controls } = useExerciseSessionContext()
	return <Button variant="contained" size="medium" startIcon={<ArrowForward />} disabled={disabled || submitting} onClick={controls.startNewExercise} title="Move to the next exercise">
		Next Exercise
	</Button>
}
