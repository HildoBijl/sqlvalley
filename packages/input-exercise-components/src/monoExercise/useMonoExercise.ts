import { useCallback, useState } from 'react'

import { getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { type InputExerciseReport, type MonoExerciseState, isMonoExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { useInputExerciseContext } from '../inputExercise'
import { useInputExerciseAvailability } from '../inputExercise/useInputExerciseAvailability'
import type { MonoExerciseReport } from './types'

export function useMonoExercise() {
	// Extract and verify data from contexts.
	const { submitting, controls, currentExercise: { definition, instance: exerciseInstance } } = useExerciseSessionContext()
	const { input: rawInput } = useInputExerciseContext()
	if (!isMonoExercise(definition)) throw new Error('MonoExercise requires a mono-exercise definition.')

	// Extract exercise status.
	const parameters = exerciseInstance.parameters
	const { history } = exerciseInstance
	const state = getCurrentState(exerciseInstance) as MonoExerciseState

	// Determine feedback to show.
	const [feedbackInput, setFeedbackInput] = useState(rawInput)
	const latestEvent = history[history.length - 1]
	const report: InputExerciseReport | undefined = latestEvent?.action.type === 'input' ? latestEvent.report : undefined
	const feedbackType = report?.type
	const feedback: Pick<MonoExerciseReport, 'message' | 'type'> | undefined = feedbackInput === rawInput && typeof report?.message === 'string' &&
		(feedbackType === 'success' || feedbackType === 'info' || feedbackType === 'warning' || feedbackType === 'error')
		? { message: report.message, type: feedbackType }
		: undefined

	// Set up a submission handler that takes into account validation status.
	const { canSubmit } = useInputExerciseAvailability()
	const complete = isStateDone(state)
	const handleSubmit = useCallback(() => {
		if (complete || !canSubmit || !rawInput) return
		setFeedbackInput(rawInput)
		void controls.submitAction({ type: 'input', input: rawInput })
	}, [controls, rawInput, complete, canSubmit])

	// Assemble all the data needed by the MonoExercise component.
	return { parameters, state, input: rawInput, feedback, report, complete, submitting, handleSubmit }
}
