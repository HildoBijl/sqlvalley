import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { useCurrentExerciseInstance, useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { ShowSolutionButton } from './MonoExercise/ShowSolutionButton'

export function ExerciseAdminTools() {
	const { exerciseIds, pending, controls } = useExerciseSessionContext()
	const exerciseInstance = useCurrentExerciseInstance()
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
			<FormControl
				size="small"
				sx={{ minWidth: { xs: '100%', sm: 240 }, maxWidth: { xs: '100%', sm: 360 } }}
				disabled={pending}
			>
				<InputLabel id="admin-exercise-select-label">Exercise</InputLabel>
				<Select
					labelId="admin-exercise-select-label"
					label="Exercise"
					value={exerciseInstance.exerciseId}
					onChange={event => controls.selectExerciseById(String(event.target.value))}
					MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
				>
					{exerciseIds.map((exerciseId, index) => (
						<MenuItem key={exerciseId} value={exerciseId} title={exerciseId}>
							{(index + 1) + '. ' + exerciseId}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<ShowSolutionButton />
		</Box>
	)
}
