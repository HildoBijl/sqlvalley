import { Box, Button } from '@mui/material'
import { ArrowForward, CheckCircle, Flag } from '@mui/icons-material'

import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { ExerciseAdminTools } from '../ExerciseAdminTools'
import { useMonoExerciseControls } from './controlsContext'

export function ExerciseControls() {
	const { admin } = useExerciseSessionContext()
	const { solved, givenUp, canSubmit, canGiveUp, onSubmit, onGiveUp, onNext } =
		useMonoExerciseControls()

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: 1,
				flexWrap: 'wrap',
				mt: 2,
				mb: 3,
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
				{admin.showControls && <ExerciseAdminTools />}
			</Box>
			<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
				{!solved ? (
					givenUp ? (
						<Button
							variant="contained"
							size="medium"
							startIcon={<ArrowForward />}
							onClick={onNext}
							title="Move to the next exercise"
						>
							Next Exercise
						</Button>
					) : (
						<>
							<Button
								variant="outlined"
								size="medium"
								startIcon={<Flag />}
								color="warning"
								onClick={onGiveUp}
								disabled={!canGiveUp}
							>
								Give Up
							</Button>
							<Button
								variant="contained"
								size="medium"
								startIcon={<CheckCircle />}
								onClick={onSubmit}
								disabled={!canSubmit}
							>
								Submit Answer
							</Button>
						</>
					)
				) : (
					<Button
						variant="contained"
						size="medium"
						startIcon={<ArrowForward />}
						onClick={onNext}
						title="Proceed to the next exercise"
					>
						Next Exercise
					</Button>
				)}
			</Box>
		</Box>
	)
}
