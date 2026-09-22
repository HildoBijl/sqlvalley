import { useCallback, useState } from 'react'

import { getCurrentState } from '@step-wise/exercise-definition'
import { useCurrentExerciseInstance, useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { useInputExerciseContext } from '../inputExercise'
import type { MonoExerciseReport } from './types'
import type { MonoExerciseRenderSpec } from './specifications'
import { isMonoExerciseHistory } from './validation'

interface MonoExerciseOptions<Parameters extends Record<string, unknown>, Input, CheckResult> {
	spec: MonoExerciseRenderSpec<Parameters, Input, CheckResult>
}

// Restores feedback from the stored report without regrading on reload.
export function useMonoExercise<Parameters extends Record<string, unknown>, Input, CheckResult>({ spec }: MonoExerciseOptions<Parameters, Input, CheckResult>) {
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

	const parameters = exerciseInstance.parameters as Parameters
	const solved = state.solved === true
	const givenUp = state.givenUp === true
	const complete = solved || givenUp
	return { parameters, state, input, feedback, lastResult, complete, submitting, handleInputChange, handleSubmit }
}
