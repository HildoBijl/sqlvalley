import { useId } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { useCurrentExerciseInstance, useExerciseSessionContext } from './exerciseSessionContext'

export function ExerciseSelection() {
	const { admin, submitting } = useExerciseSessionContext()
	const exerciseInstance = useCurrentExerciseInstance()
	const labelId = useId()

	return <FormControl
		size="small"
		sx={{ minWidth: { xs: '100%', sm: 240 }, maxWidth: { xs: '100%', sm: 360 } }}
		disabled={submitting}
	>
		<InputLabel id={labelId}>Exercise</InputLabel>
		<Select
			labelId={labelId}
			label="Exercise"
			value={exerciseInstance.exerciseId}
			onChange={event => admin.selectExerciseById(String(event.target.value))}
			MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
		>
			{admin.exerciseIds.map((exerciseId, index) => (
				<MenuItem key={exerciseId} value={exerciseId} title={exerciseId}>
					{(index + 1) + '. ' + exerciseId}
				</MenuItem>
			))}
		</Select>
	</FormControl>
}
