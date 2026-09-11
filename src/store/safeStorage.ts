import type { StateStorage } from 'zustand/middleware'

const memoryStorageValues = new Map<string, string>()
let localStorageUnavailable = false

function getLocalStorage(): Storage | undefined {
	if (localStorageUnavailable || typeof window === 'undefined') return undefined
	try {
		return window.localStorage
	} catch {
		localStorageUnavailable = true
		return undefined
	}
}

export const safeStorage: StateStorage = {
	getItem: key => {
		const storage = getLocalStorage()
		if (!storage) return memoryStorageValues.get(key) ?? null
		try {
			const value = storage.getItem(key)
			if (value !== null) memoryStorageValues.set(key, value)
			return value
		} catch {
			localStorageUnavailable = true
			return memoryStorageValues.get(key) ?? null
		}
	},

	setItem: (key, value) => {
		memoryStorageValues.set(key, value)
		const storage = getLocalStorage()
		if (!storage) return
		try {
			storage.setItem(key, value)
		} catch {
			localStorageUnavailable = true
		}
	},
	
	removeItem: key => {
		memoryStorageValues.delete(key)
		const storage = getLocalStorage()
		if (!storage) return
		try {
			storage.removeItem(key)
		} catch {
			localStorageUnavailable = true
		}
	},
}
