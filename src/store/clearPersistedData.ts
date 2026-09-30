// Clear application-owned storage. The caller reloads afterward to discard in-memory state.
export function clearPersistedData() {
	const storage = window.localStorage
	const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
	for (const key of keys) {
		if (key?.startsWith('sqlvalley-')) storage.removeItem(key)
	}
}
