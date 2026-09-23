import { getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { type MonoExerciseState, isMonoExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { useInputExerciseContext } from '../inputExercise'

export function useMonoExercise() {
	// Extract and verify data from contexts.
	const { submitting, currentExercise: { definition, instance: exerciseInstance } } = useExerciseSessionContext()
	const { input: rawInput } = useInputExerciseContext()
	if (!isMonoExercise(definition)) throw new Error('MonoExercise requires a mono-exercise definition.')

	// Extract exercise status.
	const parameters = exerciseInstance.parameters
	const state = getCurrentState(exerciseInstance) as MonoExerciseState

	const complete = isStateDone(state)

	// Assemble all the data needed by the MonoExercise component.
	return { parameters, state, input: rawInput, complete, submitting }
}
