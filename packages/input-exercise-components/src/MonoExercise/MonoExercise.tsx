import { useCallback, useMemo, useState } from 'react'
import { Alert, Box } from '@mui/material'

import { getLastRawInput } from '@step-wise/input-exercises'
import { getCurrentState } from '@step-wise/exercise-definition'

import { useCurrentExerciseInstance, useExerciseManager, useModuleContext } from '@sqlvalley/exercise-manager'

import type { MonoExerciseReport } from './types'
import { isMonoExerciseHistory } from './validation'
import { MonoExerciseControlsContext } from './controlsContext'
import { useShowSolution } from './useShowSolution'
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
	const { pending, controls } = useExerciseManager()
	const exerciseInstance = useCurrentExerciseInstance()
	if (!isMonoExerciseHistory(exerciseInstance)) throw new Error('MonoExercise requires mono state and input actions.')
	const moduleContext = useModuleContext()
	const { history, draftInput } = exerciseInstance
	const state = getCurrentState(exerciseInstance)

	const [feedbackCleared, setFeedbackCleared] = useState(false)
	const [giveUpOpen, setGiveUpOpen] = useState(false)

	const lastSubmittedInput = useMemo(() => {
		const rawInput = getLastRawInput(exerciseInstance)
		return rawInput ? spec.fromRawInput(rawInput) : undefined
	}, [exerciseInstance, spec])
	const input = draftInput !== undefined
		? spec.fromRawInput(draftInput)
		: lastSubmittedInput ?? spec.initialInput

	const latestEvent = history[history.length - 1]
	const report = latestEvent?.action.type === 'input'
		? (latestEvent.report as MonoExerciseReport | undefined)
		: undefined
	const feedback = !feedbackCleared && report ? report : null
	const lastResult = (report?.result ?? null) as CheckResult | null

	const handleInputChange = useCallback(
		(value: Input) => {
			controls.setDraftInput(spec.toRawInput(value))
			setFeedbackCleared(true)
		},
		[controls, spec],
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
	const showSolution = useShowSolution(spec, params)
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
					showSolution,
					onSubmit: handleSubmit,
					onGiveUp: () => setGiveUpOpen(true),
					onNext: controls.startNewExercise,
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
