// Keep this registry independent of exercise imports so HMR does not recreate its subscribers.
const updates = new Map<string, unknown>()
const listeners = new Map<string, Set<() => void>>()

export function getUpdatedExerciseModule(skillId: string): unknown {
	return updates.get(skillId)
}

// Called by the development-only HMR boundary injected into exercise indexes.
export function updateExerciseModule(skillId: string, module: unknown): void {
	updates.set(skillId, module)
	listeners.get(skillId)?.forEach(listener => listener())
}

export function subscribeToExerciseUpdates(skillId: string, listener: () => void): () => void {
	const subscribers = listeners.get(skillId) ?? new Set<() => void>()
	listeners.set(skillId, subscribers)
	subscribers.add(listener)
	return () => {
		subscribers.delete(listener)
		if (!subscribers.size) listeners.delete(skillId)
	}
}
