import { useCallback, useState } from 'react'
import { Alert, Box } from '@mui/material'

import { getCurrentState } from '@step-wise/exercise-definition'

import { useCurrentExerciseInstance, useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { InputExerciseProvider, useInputExerciseContext } from '../inputExercise'

import type { MonoExerciseReport } from './types'
import { isMonoExerciseHistory } from './validation'
import { ExerciseControls } from './ExerciseControls'
import { MonoExerciseSection } from './MonoExerciseSection'
import type { MonoExerciseRenderSpec } from './specifications'

interface MonoExerciseProps<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult,
> {
	spec: MonoExerciseRenderSpec<Parameters, Input, CheckResult>
}

// Restores feedback from the stored report without regrading on reload.
export function MonoExercise<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult,
>({ spec }: MonoExerciseProps<Parameters, Input, CheckResult>) {
	return <InputExerciseProvider>
		<MonoExerciseContent spec={spec} />
	</InputExerciseProvider>
}

function MonoExerciseContent<Parameters extends Record<string, unknown>, Input, CheckResult>({ spec }: MonoExerciseProps<Parameters, Input, CheckResult>) {
	const { input: rawInput, setInput } = useInputExerciseContext()
	const { submitting, controls } = useExerciseSessionContext()
	const exerciseInstance = useCurrentExerciseInstance()
	if (!isMonoExerciseHistory(exerciseInstance)) throw new Error('MonoExercise requires mono state and input actions.')
	const { history } = exerciseInstance
	const state = getCurrentState(exerciseInstance)

	const [feedbackInput, setFeedbackInput] = useState(rawInput)

	const input = rawInput === undefined ? spec.initialInput : spec.fromRawInput(rawInput)

	const latestEvent = history[history.length - 1]
	const report = latestEvent?.action.type === 'input'
		? (latestEvent.report as MonoExerciseReport | undefined)
		: undefined
	const feedback = feedbackInput === rawInput && report ? report : null
	const lastResult = (report?.result ?? null) as CheckResult | null

	const handleInputChange = useCallback(
		(value: Input) => {
			setInput(spec.toRawInput(value))
		},
		[setInput, spec],
	)

	const handleSubmit = useCallback(() => {
		setFeedbackInput(rawInput)
		void controls.submitAction({ type: 'input', input: spec.toRawInput(input) })
	}, [controls, input, rawInput, spec])

	const params = exerciseInstance.parameters as Parameters
	const storedState = state
	const solved = storedState.solved === true
	const givenUp = storedState.givenUp === true
	const complete = solved || givenUp
	const { Problem, InputArea, Solution, InputVisualization } = spec

	return (
		<Box>
			<MonoExerciseSection title={spec.problemTitle ?? 'Problem'}>
				<Problem parameters={params} />
			</MonoExerciseSection>
			<InputArea
				parameters={params}
				value={input}
				disabled={complete || submitting}
				onChange={handleInputChange}
				onSubmit={handleSubmit}
			/>
			{feedback ? <Alert severity={feedback.type} sx={{ mt: 1.5 }}>{feedback.message}</Alert> : null}
			<ExerciseControls spec={spec} onSubmit={handleSubmit} />
			{InputVisualization ? (
				<InputVisualization parameters={params} input={input} result={lastResult} state={storedState} />
			) : null}
			{complete ? <MonoExerciseSection title="Solution" collapsible>
				<Solution parameters={params} state={storedState} />
			</MonoExerciseSection> : null}
		</Box>
	)
}
