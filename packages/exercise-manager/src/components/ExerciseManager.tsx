import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Alert, Button, Typography } from '@mui/material'

import { sample } from '@step-wise/js-utils'
import { type ExerciseAction, getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { type ExerciseInstance, generateExerciseInstance } from '@sqlvalley/exercise-instances'

import { type AnyExerciseContextValue, type ExerciseRegistration, ExerciseContext } from '../exerciseContext'
import { useModuleContext } from '../moduleContext'
import { useExerciseStorage } from '../storageContext'
import { ExerciseAdminTools } from './ExerciseAdminTools'

interface ExerciseManagerProps {
	skillId: string
	exercises: readonly ExerciseRegistration[]
	showAdminControls?: boolean
}

// Keep asynchronous work and local rendering state scoped to one skill.
export function ExerciseManager(props: ExerciseManagerProps) {
	return <ExerciseManagerSession key={props.skillId} {...props} />
}

function ExerciseManagerSession({ skillId, exercises, showAdminControls = false }: ExerciseManagerProps) {
	const moduleContext = useModuleContext()
	const storage = useExerciseStorage()
	const getInstanceSnapshot = useCallback(() => storage.getInstance(skillId), [storage, skillId])
	const instance = useSyncExternalStore(storage.subscribe, getInstanceSnapshot)
	const byId = useMemo(() => new Map(exercises.map(exercise => [exercise.exerciseId, exercise])), [exercises])
	const matched = instance ? byId.get(instance.exerciseId) : undefined
	const active = (matched?.definition.metadata.version ?? 1) === instance?.version ? matched : undefined
	const [pending, setPending] = useState(false)
	const [generating, setGenerating] = useState(false)
	const [error, setError] = useState<string | null>(null)
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
		setError(null)
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
			void startExercise(registration ?? sample(exercises), () => !cancelled)
		}
		return () => { cancelled = true }
	}, [byId, exercises, initializationAttempt, instance?.parameters, moduleContext, moduleReady, skillId, startExercise, storage])

	const startNewExercise = useCallback(() => {
		if (!moduleReady || pendingRef.current || generating) return
		const current = storage.getInstance(skillId)
		const candidates = current && exercises.length > 1 ? exercises.filter(exercise => exercise.exerciseId !== current.exerciseId) : exercises
		if (candidates.length > 0) void startExercise(sample(candidates))
	}, [exercises, generating, moduleReady, skillId, startExercise, storage])

	const selectExercise = useCallback((exerciseId: string) => {
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
		setError(null)
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

	if (exercises.length === 0) return <Alert severity="info">No exercises are available yet.</Alert>
	if (!active || !instance) {
		if (error) return <Alert severity="error" action={<Button onClick={() => setInitializationAttempt(attempt => attempt + 1)}>Try again</Button>}>{error}</Alert>
		return <Typography color="text.secondary">Generating your next exercise...</Typography>
	}

	const busy = pending || generating || !moduleReady
	const adminControls = showAdminControls ? (
		<ExerciseAdminTools
			options={exercises.map((exercise, index) => ({ id: exercise.exerciseId, label: (index + 1) + '. ' + exercise.exerciseId }))}
			selectedExerciseId={active.exerciseId}
			disabled={busy}
			solutionDisabled={busy || !active.getSolutionInput}
			onExerciseSelect={selectExercise}
			onShowSolution={showSolution}
		/>
	) : undefined
	const value: AnyExerciseContextValue = {
		definition: active.definition,
		exerciseInstance: instance,
		pending: busy,
		controls: { submitAction, setDraftInput, startNewExercise, adminControls },
		skill: { id: skillId },
	}
	const { Component } = active
	return <>
		{error && <Alert severity="error">{error}</Alert>}
		<ExerciseContext.Provider key={instance.startedAt} value={value}>
			<Component />
		</ExerciseContext.Provider>
	</>
}
