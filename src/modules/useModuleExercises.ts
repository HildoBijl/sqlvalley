import { useEffect, useState } from 'react'

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { subscribeToExerciseUpdates } from './exerciseHotReload'
import { skillExerciseLoaders } from './exerciseLoaders'

interface ExerciseLoadState {
	moduleId: string
	exercises: ExerciseRegistration[]
	error?: Error
}

const emptyExercises: ExerciseRegistration[] = []

export function useModuleExercises(moduleId?: string, { enabled = true }: { enabled?: boolean } = {}) {
	const [state, setState] = useState<ExerciseLoadState>()
	const loader = enabled && moduleId ? skillExerciseLoaders[moduleId] : undefined

	useEffect(() => {
		if (!moduleId || !loader) return
		let cancelled = false
		let requestId = 0
		setState(undefined)
		const reload = async () => {
			const request = ++requestId
			try {
				const module = await loader()
				if (cancelled || request !== requestId) return
				const exercises = module.default(moduleId)
				setState({ moduleId, exercises })
			} catch (cause) {
				if (cancelled || request !== requestId) return
				setState({ moduleId, exercises: emptyExercises, error: cause instanceof Error ? cause : new Error(String(cause)) })
			}
		}
		// HMR replaces registrations without resetting the mounted exercise instance.
		const unsubscribe = import.meta.hot ? subscribeToExerciseUpdates(moduleId, () => { void reload() }) : undefined
		void reload()
		return () => {
			cancelled = true
			unsubscribe?.()
		}
	}, [moduleId, loader])

	const current = loader && state?.moduleId === moduleId ? state : undefined
	return { exercises: current?.exercises ?? emptyExercises, loading: Boolean(loader && !current), error: current?.error }
}
