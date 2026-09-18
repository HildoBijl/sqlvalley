import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type ExerciseAction, getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { type ExerciseInstance, generateExerciseInstance, selectExercise } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../exerciseManagerContext'
import { useModuleContext } from '../moduleContext'

import type { ExerciseSessionOptions } from './types'

// The owning component is keyed by skill ID so each skill gets an isolated session.
export function useExerciseSession({ skillId, exercises, currentExerciseInstance: instance, storage, selectionOptions }: ExerciseSessionOptions) {
	const moduleContext = useModuleContext()
	const byId = useMemo(() => new Map(exercises.map(exercise => [exercise.exerciseId, exercise])), [exercises])
	const matched = instance ? byId.get(instance.exerciseId) : undefined
	const active = (matched?.definition.metadata.version ?? 1) === instance?.version ? matched : undefined
	const [pending, setPending] = useState(false)
	const [generating, setGenerating] = useState(false)
	const [error, setError] = useState<string>()
	const [initializationAttempt, setInitializationAttempt] = useState(0)
	const pendingRef = useRef(false)
	const generation = useRef(0)
	const mounted = useRef(false)
	const moduleReady = moduleContext == null || (moduleContext as { ready?: boolean }).ready !== false

	useEffect(() => {
		mounted.current = true
		return () => {
			mounted.current = false
			generation.current = generation.current + 1
		}
	}, [storage])

	const startExercise = useCallback(async (registration: ExerciseRegistration, isCurrent: () => boolean = () => true) => {
		const request = ++generation.current
		setGenerating(true)
		setError(undefined)
		try {
			const exerciseInstance = await generateExerciseInstance(registration.exerciseId, registration.definition, moduleContext)
			if (!mounted.current || request !== generation.current || !isCurrent()) return
			storage.startExercise(skillId, exerciseInstance)
		} catch (cause) {
			if (mounted.current && request === generation.current && isCurrent()) setError(cause instanceof Error ? cause.message : 'Unable to generate the exercise.')
		} finally {
			if (mounted.current && request === generation.current) setGenerating(false)
		}
	}, [moduleContext, skillId, storage])

	// Restore valid instances directly; generate only when no compatible instance exists.
	useEffect(() => {
		if (!moduleReady || exercises.length === 0) return
		const current = storage.getInstance(skillId)
		const registration = current ? byId.get(current.exerciseId) : undefined
		let cancelled = false
		if (!current || !registration || (registration.definition.metadata.version ?? 1) !== current.version) {
			const selected = registration ?? selectExercise(exercises, storage.getHistory(skillId), selectionOptions)
			if (selected) void startExercise(selected, () => !cancelled)
		}
		return () => { cancelled = true }
	}, [byId, exercises, initializationAttempt, instance?.parameters, moduleContext, moduleReady, selectionOptions, skillId, startExercise, storage])

	const startNewExercise = useCallback(() => {
		if (!moduleReady || pendingRef.current || generating) return
		const selected = selectExercise(exercises, storage.getHistory(skillId), selectionOptions)
		if (selected) void startExercise(selected)
	}, [exercises, generating, moduleReady, selectionOptions, skillId, startExercise, storage])

	const selectExerciseById = useCallback((exerciseId: string) => {
		if (!moduleReady || pendingRef.current || generating) return
		const registration = byId.get(exerciseId)
		if (registration) void startExercise(registration)
	}, [byId, generating, moduleReady, startExercise])

	const showSolution = useCallback(() => {
		if (active?.getSolutionInput && instance) storage.setDraftInput(skillId, active.getSolutionInput(instance.parameters))
	}, [active, instance, skillId, storage])

	const submitAction = useCallback(async (action: ExerciseAction) => {
		const current = storage.getInstance(skillId)
		if (!active || !current || pendingRef.current || generating || !moduleReady) return
		pendingRef.current = true
		setPending(true)
		setError(undefined)
		try {
			const previousState = getCurrentState(current)
			const { state, report } = await active.definition.processSoloAction({
				parameters: current.parameters,
				state: previousState,
				action,
				context: moduleContext,
			})
			const latest = storage.getInstance(skillId)
			if (!mounted.current || latest?.parameters !== current.parameters || latest.history.length !== current.history.length) return
			storage.submitAction(skillId, action, state, report, isStateDone(state), active.isSolved(state) && !active.isSolved(previousState))
		} catch (cause) {
			if (mounted.current) setError(cause instanceof Error ? cause.message : 'Unable to submit your answer.')
		} finally {
			pendingRef.current = false
			if (mounted.current) setPending(false)
		}
	}, [active, generating, moduleContext, moduleReady, skillId, storage])

	const setDraftInput = useCallback((draftInput: ExerciseInstance['draftInput']) => {
		if (storage.getInstance(skillId)) storage.setDraftInput(skillId, draftInput)
	}, [skillId, storage])


	const retryGeneration = useCallback(() => setInitializationAttempt(attempt => attempt + 1), [])

	return {
		registration: active,
		instance,
		pending,
		generating,
		busy: pending || generating || !moduleReady,
		error,
		retryGeneration,
		submitAction,
		setDraftInput,
		startNewExercise,
		selectExerciseById,
		showSolution,
	}
}
