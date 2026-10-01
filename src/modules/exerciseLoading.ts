import { useEffect, useState } from 'react'

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

/*
 * Module-based exercise loading.
 */

export interface ModuleExercises {
	default: (moduleId: string) => ExerciseRegistration[]
}

// Define Vite-based loaders for each module's exercises.
const modules = import.meta.glob<ModuleExercises>('./*/exercises/index.ts')

/*
 * HMR Extension.
 */

const updates = new Map<string, ModuleExercises>()
const listeners = new Map<string, Set<() => void>>()

// Extend the Vite-based loaders to use the stored HMR-replacement if present. Otherwise use the original one loaded from Vite.
export const exerciseLoaders: Partial<Record<string, () => Promise<ModuleExercises>>> = Object.fromEntries(
	Object.entries(modules).map(([path, load]) => {
		const moduleId = path.split('/').slice(-3)[0]
		return [moduleId, async () => {
			const original = await load()
			const module = (import.meta.hot ? updates.get(moduleId) : undefined) ?? original
			if (typeof module.default !== 'function') throw new Error(`Exercise module "${moduleId}" has no default builder export.`)
			return module
		}]
	}),
)

// Listen for HMR replacements of one module's exercises.
export function subscribeToExerciseUpdates(moduleId: string, listener: () => void): () => void {
	const subscribers = listeners.get(moduleId) ?? new Set<() => void>()
	listeners.set(moduleId, subscribers)
	subscribers.add(listener)
	return () => {
		subscribers.delete(listener)
		if (!subscribers.size) listeners.delete(moduleId)
	}
}

// Vite's HMR system calls this function through a plugin. When called, store the HMR replacement and notify the mounted consumers of that module.
export function updateExerciseModule(moduleId: string, module: ModuleExercises): void {
	updates.set(moduleId, module)
	listeners.get(moduleId)?.forEach(listener => listener())
}

/*
 * Loading hooks.
 */

interface ExerciseLoadState {
	moduleId: string
	exercises: ExerciseRegistration[]
	error?: Error
}

const emptyExercises: ExerciseRegistration[] = []

// Dynamically load a module's exercises and track updates to them. Returns the current exercises, loading state, and any error encountered while loading.
export function useModuleExercises(moduleId?: string, { enabled = true }: { enabled?: boolean } = {}) {
	const [state, setState] = useState<ExerciseLoadState>()
	const loader = enabled && moduleId ? exerciseLoaders[moduleId] : undefined

	// Reload exercises when the module changes.
	useEffect(() => {
		if (!moduleId || !loader) return
		let cancelled = false
		let requestId = 0
		setState(undefined)

		// Start the exercise loader and store its results into the state.
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
		void reload()

		// Subscribe to updates from HMR on this module: when the module is hot-reloaded, reload the exercises.
		const unsubscribe = import.meta.hot ? subscribeToExerciseUpdates(moduleId, () => { void reload() }) : undefined

		// Upon dismount, ignore any pending load results and stop listening to updates.
		return () => {
			cancelled = true
			unsubscribe?.()
		}
	}, [moduleId, loader])

	// Determine and return the current loading status based on the loader and the state.
	const current = loader && state?.moduleId === moduleId ? state : undefined
	return {
		exercises: current?.exercises ?? emptyExercises,
		loading: Boolean(loader && !current),
		error: current?.error,
	}
}
