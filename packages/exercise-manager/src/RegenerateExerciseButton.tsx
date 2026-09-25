import { Button } from '@mui/material'
import { Refresh } from '@mui/icons-material'

import { useCurrentExerciseInstance, useExerciseSessionContext } from './exerciseSessionContext'

export function RegenerateExerciseButton() {
	const { admin, submitting } = useExerciseSessionContext()
	const { exerciseId } = useCurrentExerciseInstance()
	if (!admin.showControls) return null
	return <Button size="small" variant="outlined" startIcon={<Refresh />} disabled={submitting} onClick={() => admin.selectExerciseById(exerciseId)}>
		Regenerate
	</Button>
}
