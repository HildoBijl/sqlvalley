import { Box } from '@mui/material'

import { getCurrentState } from '@step-wise/exercise-definition'
import { useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import { ExerciseAdminTools, NextExerciseButton, GiveUpButton, SubmitAnswerButton, useInputExerciseContext } from '../../inputExercise'
import type { MonoExerciseRenderSpec } from '../specifications'

interface ExerciseControlsProps<Parameters extends Record<string, unknown>, Input, CheckResult> {
	spec: MonoExerciseRenderSpec<Parameters, Input, CheckResult>
	onSubmit: () => void
}

export function ExerciseControls<Parameters extends Record<string, unknown>, Input, CheckResult>({ spec, onSubmit }: ExerciseControlsProps<Parameters, Input, CheckResult>) {
	const { submitting, currentExercise: { instance } } = useExerciseSessionContext()
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

	return <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 2, mb: 3 }}>
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
			<ExerciseAdminTools />
		</Box>
		<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
			{complete ? <NextExerciseButton /> : <>
				<GiveUpButton disabled={!canGiveUp} />
				<SubmitAnswerButton disabled={!canSubmit} onSubmit={onSubmit} />
			</>}
		</Box>
	</Box>
}
