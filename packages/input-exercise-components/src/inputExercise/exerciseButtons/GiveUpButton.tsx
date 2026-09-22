import { useState } from 'react'
import { Button } from '@mui/material'
import { Flag } from '@mui/icons-material'

import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { GiveUpDialog } from './GiveUpDialog'

import { useInputExerciseAvailability } from '../useInputExerciseAvailability'

export interface GiveUpButtonProps {
	disabled?: boolean
}

export function GiveUpButton({ disabled = false }: GiveUpButtonProps) {
	const { controls } = useExerciseSessionContext()
	const [open, setOpen] = useState(false)
	const { canGiveUp } = useInputExerciseAvailability()
	const unavailable = disabled || !canGiveUp

	const handleGiveUp = () => {
		if (unavailable) return
		setOpen(false)
		void controls.submitAction({ type: 'giveUp' })
	}

	return <>
		<Button variant="outlined" size="medium" startIcon={<Flag />} color="warning" disabled={unavailable} onClick={() => setOpen(true)}>
			Give Up
		</Button>
		<GiveUpDialog open={open} disabled={unavailable} onConfirm={handleGiveUp} onCancel={() => setOpen(false)} />
	</>
}
