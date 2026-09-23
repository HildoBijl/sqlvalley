import { deepEqual } from '@step-wise/js-utils'
import { getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { type InputExerciseRawInput, type InputExerciseReport, type MonoExerciseState, isMonoExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { useInputExerciseContext } from '../inputExercise'
import type { MonoExerciseReport } from './types'

export function useMonoExercise() {
	// Extract and verify data from contexts.
	const { submitting, currentExercise: { definition, instance: exerciseInstance } } = useExerciseSessionContext()
	const { input: rawInput, normalizeInput } = useInputExerciseContext()
	if (!isMonoExercise(definition)) throw new Error('MonoExercise requires a mono-exercise definition.')

	// Extract exercise status.
	const parameters = exerciseInstance.parameters
	const { history } = exerciseInstance
	const state = getCurrentState(exerciseInstance) as MonoExerciseState

	// Determine feedback to show.
	const latestEvent = history[history.length - 1]
	const submittedInput = latestEvent?.action.type === 'input' && latestEvent.action.input && typeof latestEvent.action.input === 'object' && !Array.isArray(latestEvent.action.input) ? latestEvent.action.input as InputExerciseRawInput : undefined
	const inputMatchesSubmission = submittedInput !== undefined && deepEqual(submittedInput, normalizeInput(rawInput))
	const report: InputExerciseReport | undefined = inputMatchesSubmission ? latestEvent.report : undefined
	const feedbackType = report?.type
	const feedback: Pick<MonoExerciseReport, 'message' | 'type'> | undefined = typeof report?.message === 'string' &&
		(feedbackType === 'success' || feedbackType === 'info' || feedbackType === 'warning' || feedbackType === 'error')
		? { message: report.message, type: feedbackType }
		: undefined

	const complete = isStateDone(state)

	// Assemble all the data needed by the MonoExercise component.
	return { parameters, state, input: rawInput, feedback, report, complete, submitting }
}
