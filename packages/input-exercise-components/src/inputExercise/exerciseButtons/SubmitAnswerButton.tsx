import { Button } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

import { useInputExerciseAvailability } from '../useInputExerciseAvailability'

export interface SubmitAnswerButtonProps {
	disabled?: boolean
	onSubmit: () => void
}

export function SubmitAnswerButton({ disabled = false, onSubmit }: SubmitAnswerButtonProps) {
	const { canSubmit } = useInputExerciseAvailability()
	return <Button variant="contained" size="medium" startIcon={<CheckCircle />} disabled={disabled || !canSubmit} onClick={onSubmit}>
		Submit Answer
	</Button>
}
