import { useCallback, useState } from 'react'
import { Alert, Box } from '@mui/material'

import { getCurrentState } from '@step-wise/exercise-definition'

import { useCurrentExerciseInstance, useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import { InputExerciseProvider, useInputExerciseContext } from '../inputExercise'

import type { MonoExerciseReport } from './types'
import { isMonoExerciseHistory } from './validation'
import { MonoExerciseControlsContext } from './controlsContext'
import { ExerciseControls } from './ExerciseControls'
import { MonoExerciseSection } from './MonoExerciseSection'
import { GiveUpDialog } from './GiveUpDialog'
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
	const moduleContext = useModuleContext()
	const { history } = exerciseInstance
	const state = getCurrentState(exerciseInstance)

	const [feedbackInput, setFeedbackInput] = useState(rawInput)
	const [giveUpOpen, setGiveUpOpen] = useState(false)

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

	const handleGiveUp = useCallback(() => {
		setGiveUpOpen(false)
		void controls.submitAction({ type: 'giveUp' })
	}, [controls])

	const params = exerciseInstance.parameters as Parameters
	const storedState = state
	const solved = storedState.solved === true
	const givenUp = storedState.givenUp === true
	const complete = solved || givenUp
	const availabilityArgs = { parameters: params, input, moduleContext }
	const canSubmit = !complete && !submitting && !(spec.isInputEmpty?.(input) ?? false) &&
		(spec.canSubmit?.(availabilityArgs) ?? true)
	const canGiveUp = !complete && !submitting && (spec.canGiveUp?.(availabilityArgs) ?? true)
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
			<MonoExerciseControlsContext.Provider
				value={{
					solved,
					givenUp,
					canSubmit,
					canGiveUp,
					onSubmit: handleSubmit,
					onGiveUp: () => setGiveUpOpen(true),
					onNext: controls.startNewExercise,
				}}
			>
				<ExerciseControls />
			</MonoExerciseControlsContext.Provider>
			{InputVisualization ? (
				<InputVisualization parameters={params} input={input} result={lastResult} state={storedState} />
			) : null}
			{complete ? <MonoExerciseSection title="Solution" collapsible>
				<Solution parameters={params} state={storedState} />
			</MonoExerciseSection> : null}
			<GiveUpDialog open={giveUpOpen} onConfirm={handleGiveUp} onCancel={() => setGiveUpOpen(false)} />
		</Box>
	)
}
