import { useContext } from 'react'

import type { ExerciseSessionContextValue } from './types'
import { ExerciseSessionContext } from './context'

// Get the full context value.
export function useExerciseSessionContext(): ExerciseSessionContextValue {
	const value = useContext(ExerciseSessionContext)
	if (!value) throw new Error('useExerciseSessionContext must be used within an ExerciseManager.')
	return value
}

// Get the current exercise out of the context.
export function useCurrentExercise() {
	return useExerciseSessionContext().currentExercise
}

// Specifically get the exercise's instance out of the context.
export function useCurrentExerciseInstance() {
	return useCurrentExercise().instance
}
