import { Button } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

interface CompleteModuleButtonProps {
	onComplete: () => void
	label?: string
}

export function CompleteModuleButton({ onComplete, label = 'Mark as Complete' }: CompleteModuleButtonProps) {
	return <Button variant="contained" onClick={onComplete} startIcon={<CheckCircle />}>{label}</Button>
}
