import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

export interface ModuleExercises {
	default: (moduleId: string) => ExerciseRegistration[]
}

// Keep this registry independent of the loader's glob to avoid a runtime import cycle through exercise indexes.
const updates = new Map<string, ModuleExercises>()
const listeners = new Map<string, Set<() => void>>()

// Obtain the most recent exercise module for the given module ID.
export function getExerciseModuleUpdate(moduleId: string) {
	return updates.get(moduleId)
}

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
