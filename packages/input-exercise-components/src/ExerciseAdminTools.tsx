import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { useCurrentExerciseInstance, useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { ShowSolutionButton } from './monoExercise/ShowSolutionButton'

export function ExerciseAdminTools() {
	const { admin, submitting } = useExerciseSessionContext()
	const exerciseInstance = useCurrentExerciseInstance()
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
			<FormControl
				size="small"
				sx={{ minWidth: { xs: '100%', sm: 240 }, maxWidth: { xs: '100%', sm: 360 } }}
				disabled={submitting}
			>
				<InputLabel id="admin-exercise-select-label">Exercise</InputLabel>
				<Select
					labelId="admin-exercise-select-label"
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
			<ShowSolutionButton />
		</Box>
	)
}
