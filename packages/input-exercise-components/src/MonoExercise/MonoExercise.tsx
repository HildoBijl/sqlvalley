import { useCallback, useMemo, useState } from 'react'
import { Alert, Box } from '@mui/material'

import { type InputExerciseAction, type MonoExerciseState, getLastRawInput } from '@step-wise/input-exercises'
import { type ExerciseParameters, getCurrentState } from '@step-wise/exercise-definition'

import { useExercise, useModuleContext } from '@sqlvalley/exercise-manager'

import type { MonoExerciseReport } from './types'
import { MonoExerciseControlsContext } from './controlsContext'
import { ExerciseControls } from './ExerciseControls'
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
	const { exerciseInstance, pending, controls } = useExercise<ExerciseParameters, InputExerciseAction, MonoExerciseState>()
	const moduleContext = useModuleContext()
	const { history, draftInput } = exerciseInstance
	const state = getCurrentState(exerciseInstance)

	const [feedbackCleared, setFeedbackCleared] = useState(false)
	const [giveUpOpen, setGiveUpOpen] = useState(false)

	const lastSubmittedInput = useMemo(() => {
		const rawInput = getLastRawInput(exerciseInstance)
		return rawInput ? spec.fromRawInput(rawInput) : undefined
	}, [exerciseInstance, spec])
	const input = (draftInput !== undefined ? draftInput : lastSubmittedInput ?? spec.initialInput) as Input

	const latestEvent = history[history.length - 1]
	const report = latestEvent?.action.type === 'input'
		? (latestEvent.report as MonoExerciseReport | undefined)
		: undefined
	const feedback = !feedbackCleared && report ? report : null
	const lastResult = (report?.result ?? null) as CheckResult | null

	const handleInputChange = useCallback(
		(value: Input) => {
			controls.setDraftInput(value)
			setFeedbackCleared(true)
		},
		[controls],
	)

	const handleSubmit = useCallback(() => {
		setFeedbackCleared(false)
		void controls.submitAction({ type: 'input', input: spec.toRawInput(input) })
	}, [controls, input, spec])

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
	const canSubmit = !complete && !pending && !(spec.isInputEmpty?.(input) ?? false) &&
		(spec.canSubmit?.(availabilityArgs) ?? true)
	const canGiveUp = !complete && !pending && (spec.canGiveUp?.(availabilityArgs) ?? true)
	const { Prompt, Problem, Input: InputComponent, Solution, Payoff, Output } = spec

	return (
		<Box>
			{Prompt ? <Prompt parameters={params} /> : null}
			<Problem parameters={params} />
			<InputComponent
				parameters={params}
				value={input}
				disabled={complete || pending}
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
					adminControls: controls.adminControls,
				}}
			>
				<ExerciseControls />
			</MonoExerciseControlsContext.Provider>
			{Output ? (
				<Output parameters={params} input={input} result={lastResult} state={storedState} />
			) : null}
			{complete ? <Solution parameters={params} state={storedState} /> : null}
			{solved && lastResult && Payoff ? <Payoff parameters={params} result={lastResult} /> : null}
			<GiveUpDialog open={giveUpOpen} onConfirm={handleGiveUp} onCancel={() => setGiveUpOpen(false)} />
		</Box>
	)
}
