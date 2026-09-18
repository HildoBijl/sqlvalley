import { useContext } from 'react'

import type { ExerciseManagerContextValue } from './types'
import { ExerciseManagerContext } from './context'

// Get the full context value.
export function useExerciseManager(): ExerciseManagerContextValue {
	const value = useContext(ExerciseManagerContext)
	if (!value) throw new Error('useExerciseManager must be used within an ExerciseManager.')
	return value
}

// Get the current exercise out of the context.
export function useCurrentExercise() {
	return useExerciseManager().currentExercise
}

// Specifically get the exercise's instance out of the context.
export function useCurrentExerciseInstance() {
	return useCurrentExercise().instance
}
