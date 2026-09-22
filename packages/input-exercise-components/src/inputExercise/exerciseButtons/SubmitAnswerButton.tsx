import { Button } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

export interface SubmitAnswerButtonProps {
	disabled?: boolean
	onSubmit: () => void
}

export function SubmitAnswerButton({ disabled = false, onSubmit }: SubmitAnswerButtonProps) {
	const { submitting } = useExerciseSessionContext()
	return <Button variant="contained" size="medium" startIcon={<CheckCircle />} disabled={disabled || submitting} onClick={onSubmit}>
		Submit Answer
	</Button>
}
