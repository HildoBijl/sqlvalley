import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { ArrowForward, CheckCircle, Flag } from '@mui/icons-material'

import { getCurrentState } from '@step-wise/exercise-definition'
import { useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import { ExerciseAdminTools } from '../ExerciseAdminTools'
import { useInputExerciseContext } from '../inputExercise'
import type { MonoExerciseRenderSpec } from './specifications'
import { GiveUpDialog } from './GiveUpDialog'

interface ExerciseControlsProps<Parameters extends Record<string, unknown>, Input, CheckResult> {
	spec: MonoExerciseRenderSpec<Parameters, Input, CheckResult>
	onSubmit: () => void
}

export function ExerciseControls<Parameters extends Record<string, unknown>, Input, CheckResult>({ spec, onSubmit }: ExerciseControlsProps<Parameters, Input, CheckResult>) {
	const { admin, submitting, controls, currentExercise: { instance } } = useExerciseSessionContext()
	const { input: rawInput } = useInputExerciseContext()
	const moduleContext = useModuleContext()
	const state = getCurrentState(instance)
	const solved = state.solved === true
	const givenUp = state.givenUp === true
	const complete = solved || givenUp
	const input = rawInput === undefined ? spec.initialInput : spec.fromRawInput(rawInput)
	const availabilityArgs = { parameters: instance.parameters as Parameters, input, moduleContext }
	const canSubmit = !complete && !submitting && !(spec.isInputEmpty?.(input) ?? false) &&
		(spec.canSubmit?.(availabilityArgs) ?? true)
	const canGiveUp = !complete && !submitting && (spec.canGiveUp?.(availabilityArgs) ?? true)
	const [giveUpOpen, setGiveUpOpen] = useState(false)

	const handleGiveUp = () => {
		setGiveUpOpen(false)
		void controls.submitAction({ type: 'giveUp' })
	}

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
							onClick={controls.startNewExercise}
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
								onClick={() => setGiveUpOpen(true)}
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
						onClick={controls.startNewExercise}
						title="Proceed to the next exercise"
					>
						Next Exercise
					</Button>
				)}
			</Box>
			<GiveUpDialog open={giveUpOpen} onConfirm={handleGiveUp} onCancel={() => setGiveUpOpen(false)} />
		</Box>
	)
}
