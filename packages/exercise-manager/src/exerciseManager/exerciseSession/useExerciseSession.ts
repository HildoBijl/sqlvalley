import { useMemo, useRef } from 'react'

import { useModuleContext } from '../../moduleContext'
import type { ExerciseSessionOptions } from './types'
import { useExerciseGeneration } from './useExerciseGeneration'
import { useExerciseSubmission } from './useExerciseSubmission'

// Coordinate availability; each hook owns its asynchronous lifecycle.
export function useExerciseSession(options: ExerciseSessionOptions) {
	const { exercises, currentExerciseInstance } = options

	// Check the module status.
	const moduleContext = useModuleContext()
	const moduleReady = moduleContext == null || (moduleContext as { ready?: boolean }).ready !== false

	// Extract and verify the current exercise's registration.
	const exercisesById = useMemo(() => new Map(exercises.map(exercise => [exercise.exerciseId, exercise])), [exercises])
	const mostRecentRegistration = currentExerciseInstance ? exercisesById.get(currentExerciseInstance.exerciseId) : undefined
	const currentRegistration = (mostRecentRegistration?.definition.metadata.version ?? 1) === currentExerciseInstance?.version ? mostRecentRegistration : undefined

	// Set up the session for the various domains. Give them an activeOperation flag to share, so they can check if anyone is doing anything.
	const activeOperation = useRef<'generation' | 'submission' | undefined>(undefined)
	const shared = { moduleContext, moduleReady, activeOperation }
	const generation = useExerciseGeneration({ ...options, ...shared, exercisesById })
	const submission = useExerciseSubmission({ ...options, ...shared, registration: currentRegistration })

	// Bundle the various session parts.
	return {
		registration: currentRegistration,
		instance: currentExerciseInstance,
		loading: !moduleReady,
		...generation,
		...submission,
	}
}
