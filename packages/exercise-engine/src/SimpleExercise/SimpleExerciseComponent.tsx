import { useCallback, useMemo, useState } from 'react'
import { Alert, Box } from '@mui/material'

import type { PlainDataValue } from '@step-wise/js-utils'
import { getCurrentState } from '@step-wise/exercise-definition'

import { useExercise } from '../Exercise'
import { useModuleContext } from '../moduleContext'
import type { SimpleExerciseReport } from './buildSimpleExercise'
import { SimpleExerciseControlsContext } from './controlsContext'
import { ExerciseControls } from './ExerciseControls'
import { GiveUpDialog } from './GiveUpDialog'
import { isSimpleExerciseGivenUp, isSimpleExerciseSolved } from './logic'
import type { SimpleExerciseRenderSpec } from './specifications'
import type { SimpleExerciseStoredState } from './types'

interface SimpleExerciseComponentProps<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult,
> {
	spec: SimpleExerciseRenderSpec<Parameters, Input, CheckResult>
}

/**
 * Renders the active exercise from context and handles submit/give-up. Feedback is
 * derived from the latest stored report, so it survives a reload without regrading.
 */
export function SimpleExerciseComponent<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult,
>({ spec }: SimpleExerciseComponentProps<Parameters, Input, CheckResult>) {
	const { exerciseInstance, pending, controls } = useExercise()
	const moduleContext = useModuleContext()
	const { history, draftInput } = exerciseInstance
	const state = getCurrentState(exerciseInstance)

	const [feedbackCleared, setFeedbackCleared] = useState(false)
	const [giveUpOpen, setGiveUpOpen] = useState(false)

	const lastSubmittedInput = useMemo(() => {
		for (let i = history.length - 1; i >= 0; i -= 1) {
			if (history[i].action.type === 'input') return history[i].action.input as Input
		}
		return undefined
	}, [history])
	const input = (draftInput !== undefined ? draftInput : lastSubmittedInput ?? spec.initialInput) as Input

	const latestEvent = history[history.length - 1]
	const report = latestEvent?.action.type === 'input'
		? (latestEvent.report as SimpleExerciseReport | undefined)
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
		void controls.submitAction({ type: 'input', input: input as PlainDataValue })
	}, [controls, input])

	const handleGiveUp = useCallback(() => {
		setGiveUpOpen(false)
		void controls.submitAction({ type: 'give-up' })
	}, [controls])

	const params = exerciseInstance.parameters as Parameters
	const storedState = state as SimpleExerciseStoredState
	const solved = isSimpleExerciseSolved(storedState)
	const givenUp = isSimpleExerciseGivenUp(storedState)
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
			<SimpleExerciseControlsContext.Provider
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
			</SimpleExerciseControlsContext.Provider>
			{Output ? (
				<Output parameters={params} input={input} result={lastResult} state={storedState} />
			) : null}
			{complete ? <Solution parameters={params} state={storedState} /> : null}
			{solved && lastResult && Payoff ? <Payoff parameters={params} result={lastResult} /> : null}
			<GiveUpDialog open={giveUpOpen} onConfirm={handleGiveUp} onCancel={() => setGiveUpOpen(false)} />
		</Box>
	)
}
