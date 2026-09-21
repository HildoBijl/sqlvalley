import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ensureSetup } from '@step-wise/skill-setup'
import { type ExerciseAction, getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { type ExerciseInstance, generateExerciseInstance, selectExercise } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../exerciseSessionContext'
import { useModuleContext } from '../moduleContext'

import type { ExerciseSessionOptions } from './types'

// The owning component is keyed by skill ID so each skill gets an isolated session.
export function useExerciseSession({ skillId, exercises, currentExerciseInstance: instance, storage, selectionOptions }: ExerciseSessionOptions) {
	const moduleContext = useModuleContext()
	const byId = useMemo(() => new Map(exercises.map(exercise => [exercise.exerciseId, exercise])), [exercises])
	const matched = instance ? byId.get(instance.exerciseId) : undefined
	const active = (matched?.definition.metadata.version ?? 1) === instance?.version ? matched : undefined
	const [submitting, setSubmitting] = useState(false)
	const [generating, setGenerating] = useState(false)
	const [error, setError] = useState<string>()
	const [initializationAttempt, setInitializationAttempt] = useState(0)
	const submittingRef = useRef(false)
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
			if (typeof registration.definition.processSoloAction !== 'function') throw new Error(`Exercise "${registration.exerciseId}" does not support solo actions.`)
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
		if (!moduleReady || submittingRef.current || generating) return
		const selected = selectExercise(exercises, storage.getHistory(skillId), selectionOptions)
		if (selected) void startExercise(selected)
	}, [exercises, generating, moduleReady, selectionOptions, skillId, startExercise, storage])

	const selectExerciseById = useCallback((exerciseId: string) => {
		if (!moduleReady || submittingRef.current || generating) return
		const registration = byId.get(exerciseId)
		if (registration) void startExercise(registration)
	}, [byId, generating, moduleReady, startExercise])

	const submitAction = useCallback(async (action: ExerciseAction) => {
		const current = storage.getInstance(skillId)
		if (!active || !current || submittingRef.current || generating || !moduleReady) return
		submittingRef.current = true
		setSubmitting(true)
		setError(undefined)
		try {
			if (typeof active.definition.processSoloAction !== 'function') throw new Error(`Exercise "${active.exerciseId}" does not support solo actions.`)
			const solvedSkillIds: string[] = []
			const previousState = getCurrentState(current)
			const { state, report } = await active.definition.processSoloAction({
				parameters: current.parameters,
				state: previousState,
				action,
				context: moduleContext,
				updateSkills: (setupLike, correct) => {
					const setup = ensureSetup(setupLike)
					if (correct && setup.type === 'Skill') solvedSkillIds.push(...setup.getSkillList())
				},
			})
			const latest = storage.getInstance(skillId)
			if (!mounted.current || latest?.parameters !== current.parameters || latest.history.length !== current.history.length) return
			storage.submitAction(skillId, action, state, report, isStateDone(state), solvedSkillIds)
		} catch (cause) {
			if (mounted.current) setError(cause instanceof Error ? cause.message : 'Unable to submit your answer.')
		} finally {
			submittingRef.current = false
			if (mounted.current) setSubmitting(false)
		}
	}, [active, generating, moduleContext, moduleReady, skillId, storage])

	const setDraftInput = useCallback((draftInput: ExerciseInstance['draftInput']) => {
		if (storage.getInstance(skillId)) storage.setDraftInput(skillId, draftInput)
	}, [skillId, storage])


	const retryGeneration = useCallback(() => setInitializationAttempt(attempt => attempt + 1), [])

	return {
		registration: active,
		instance,
		submitting,
		generating,
		loading: generating || !moduleReady,
		error,
		retryGeneration,
		submitAction,
		setDraftInput,
		startNewExercise,
		selectExerciseById,
	}
}
