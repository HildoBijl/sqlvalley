import { useMemo, useRef } from 'react'

import type { ExerciseSessionOptions } from './types'
import { useExerciseGeneration } from './useExerciseGeneration'
import { useExerciseSubmission } from './useExerciseSubmission'

// Coordinate availability; each hook owns its asynchronous lifecycle.
export function useExerciseSession(options: ExerciseSessionOptions) {
	const { exercises, currentExerciseInstance, resources } = options

	// Check the supplied context status.
	const resourceError = resources?.error
	const loading = resources?.loading ?? false
	const contextReady = !loading && !resourceError

	// Extract and verify the current exercise's registration.
	const exercisesById = useMemo(() => new Map(exercises.map(exercise => [exercise.exerciseId, exercise])), [exercises])
	const matchingRegistration = currentExerciseInstance ? exercisesById.get(currentExerciseInstance.exerciseId) : undefined
	const currentRegistration = (matchingRegistration?.definition.metadata.version ?? 1) === currentExerciseInstance?.version ? matchingRegistration : undefined

	// Set up the session for the various domains. Give them an activeOperation flag to share, so they can check if anyone is doing anything.
	const activeOperation = useRef<'generation' | 'submission' | undefined>(undefined)
	const shared = { context: resources?.context, contextReady, activeOperation }
	const generation = useExerciseGeneration({ ...options, ...shared, exercisesById })
	const submission = useExerciseSubmission({ ...options, ...shared, registration: currentRegistration })

	// Bundle the various session parts.
	return {
		registration: currentRegistration,
		instance: currentExerciseInstance,
		loading,
		resourceError,
		...generation,
		...submission,
	}
}
