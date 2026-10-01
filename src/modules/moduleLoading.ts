import { use } from 'react'

import type { ModuleImplementation } from '@/learning'

// Define Vite-based loaders for each module's complete implementation.
const loadersByPath = import.meta.glob<ModuleImplementation>('./*/index.ts')
const moduleLoaders: Record<string, () => Promise<ModuleImplementation>> = Object.fromEntries(Object.entries(loadersByPath).map(([path, load]) => {
	const moduleId = path.split('/').slice(-2)[0]
	return [moduleId, load]
}))

// Load a module once and reuse its promise across renders.
const modulePromises = new Map<string, Promise<ModuleImplementation>>()
function loadModule(moduleId: string): Promise<ModuleImplementation> {
	// Return the cached module promise if it has already been loaded.
	const existingPromise = modulePromises.get(moduleId)
	if (existingPromise) return existingPromise

	// Load the module's implementation and cache it for future use.
	const loader = moduleLoaders[moduleId]
	if (!loader) throw new Error(`Missing implementation for module "${moduleId}".`)
	const promise = loader()
	modulePromises.set(moduleId, promise)
	return promise
}

// Suspend rendering until the complete module implementation is available.
export function useModule(moduleId: string): ModuleImplementation {
	return use(loadModule(moduleId))
}
