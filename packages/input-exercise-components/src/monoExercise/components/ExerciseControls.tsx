import { Box } from '@mui/material'

import { isExerciseDone } from '@step-wise/exercise-definition'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { ExerciseAdminTools, NextExerciseButton, GiveUpButton, SubmitAnswerButton } from '../../inputExercise'

export function ExerciseControls() {
	const { currentExercise: { instance } } = useExerciseSessionContext()
	const complete = isExerciseDone(instance)

	return <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 2, mb: 3 }}>
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
			<ExerciseAdminTools />
		</Box>
		<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
			{complete ? <NextExerciseButton /> : <>
				<GiveUpButton />
				<SubmitAnswerButton />
			</>}
		</Box>
	</Box>
}
