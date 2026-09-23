import { useContext, useMemo } from 'react'

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

// Get the current exercise definition; consumers narrow its exercise-specific features.
export function useExerciseDefinition() {
	return useCurrentExercise().definition
}

// Specifically get the exercise's instance out of the context.
export function useCurrentExerciseInstance() {
	return useCurrentExercise().instance
}

// Get the latest input event together with its report, skipping other action types.
export function useLastInputEvent() {
	const { history } = useCurrentExerciseInstance()
	return useMemo(() => [...history].reverse().find(event => event.action.type === 'input'), [history])
}
