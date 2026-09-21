import { useCallback, useEffect, useRef, useState } from 'react'

import { useIsMountedRef } from '@step-wise/react-utils'
import { generateExerciseInstance, selectExercise } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../../exerciseSessionContext'
import type { ExerciseSessionOptions, ExerciseSessionDependencies } from './types'

interface GenerationError {
	message: string
	registration: ExerciseRegistration
}

interface GenerationOptions extends ExerciseSessionOptions, ExerciseSessionDependencies {
	exercisesById: ReadonlyMap<string, ExerciseRegistration>
}

export function useExerciseGeneration({ skillId, exercises, currentExerciseInstance, storage, selectionOptions, exercisesById, moduleContext, moduleReady, activeOperation }: GenerationOptions) {
	const [generationError, setGenerationError] = useState<GenerationError>()
	const [generating, setGenerating] = useState(false)
	const generationRequestId = useRef(0)
	const mounted = useIsMountedRef()

	useEffect(() => {
		return () => {
			generationRequestId.current = generationRequestId.current + 1
			if (activeOperation.current === 'generation') activeOperation.current = undefined
		}
	}, [storage, activeOperation])

	// Handler: generate and save an exercise instance from a given exercise registration.
	const startExercise = useCallback(async (exerciseRegistration: ExerciseRegistration, isStillRequested: () => boolean = () => true) => {
		// Make sure everything is ready and no actions are ongoing.
		if (!moduleReady || activeOperation.current === 'submission') return
		activeOperation.current = 'generation'

		// Use the exercise registration/definition to generate the exercise.
		const requestId = ++generationRequestId.current
		setGenerating(true)
		setGenerationError(undefined)
		try {
			if (typeof exerciseRegistration.definition.processSoloAction !== 'function') throw new Error(`Exercise "${exerciseRegistration.exerciseId}" does not support solo actions.`)
			const exerciseInstance = await generateExerciseInstance(exerciseRegistration.exerciseId, exerciseRegistration.definition, moduleContext)

			// When the exercise is generated, verify that it's still relevant/needed. If so, store it.
			if (!mounted.current || requestId !== generationRequestId.current || !isStillRequested()) return
			storage.startExercise(skillId, exerciseInstance)
		} catch (cause) {
			if (mounted.current && requestId === generationRequestId.current && isStillRequested()) setGenerationError({ message: cause instanceof Error ? cause.message : 'Unable to generate the exercise.', registration: exerciseRegistration })
		} finally {
			if (mounted.current && requestId === generationRequestId.current) {
				activeOperation.current = undefined
				setGenerating(false)
			}
		}
	}, [moduleContext, moduleReady, mounted, activeOperation, skillId, storage])

	// Handler: start a new exercise. Randomly select one and then generate/store it.
	const startNewExercise = useCallback(() => {
		if (!moduleReady || activeOperation.current !== undefined) return
		const selected = selectExercise(exercises, storage.getExerciseHistory(skillId), selectionOptions)
		if (selected) void startExercise(selected)
	}, [exercises, moduleReady, activeOperation, selectionOptions, skillId, startExercise, storage])

	// Handler: start a new exercise, but instead of randomly selecting it, pick the given exercise ID.
	const selectExerciseById = useCallback((exerciseId: string) => {
		if (!moduleReady || activeOperation.current !== undefined) return
		const registration = exercisesById.get(exerciseId)
		if (registration) void startExercise(registration)
	}, [exercisesById, moduleReady, activeOperation, startExercise])

	// Handler: Upon a generation error, retry generating the same exercise.
	const retryGeneration = useCallback(() => {
		if (!generationError || !moduleReady || activeOperation.current !== undefined) return
		void startExercise(generationError.registration)
	}, [generationError, moduleReady, activeOperation, startExercise])

	// Effect: When there is no exercise instance, or its registration is missing, then generate a new random exercise. If the exercise is outdated (wrong version) then regenerate the same exercise with the newest version.
	useEffect(() => {
		if (!moduleReady || exercises.length === 0) return
		const instance = storage.getCurrentInstance(skillId)
		const registration = instance ? exercisesById.get(instance.exerciseId) : undefined
		let cancelled = false
		if (!instance || !registration || (registration.definition.metadata.version ?? 1) !== instance.version) {
			const selected = registration ?? selectExercise(exercises, storage.getExerciseHistory(skillId), selectionOptions)
			if (selected) void startExercise(selected, () => !cancelled)
		}
		return () => { cancelled = true }
	}, [exercisesById, exercises, currentExerciseInstance?.exerciseId, currentExerciseInstance?.version, currentExerciseInstance?.parameters, moduleContext, moduleReady, activeOperation, selectionOptions, skillId, startExercise, storage])

	// All done. Gather and return the session flags/handlers.
	return { generationError, generating, startNewExercise, selectExerciseById, retryGeneration }
}
