import { Button } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

import { useInputExerciseContext } from '../hooks'

export interface SubmitAnswerButtonProps {
	disabled?: boolean
}

export function SubmitAnswerButton({ disabled = false }: SubmitAnswerButtonProps) {
	const { isSubmitButtonEnabled, submitInput } = useInputExerciseContext()
	return <Button variant="contained" size="medium" startIcon={<CheckCircle />} disabled={disabled || !isSubmitButtonEnabled} onClick={submitInput}>
		Submit Answer
	</Button>
}
