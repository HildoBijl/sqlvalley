import { lazy } from 'react'

import type { ModuleProviderComponent } from '@sqlvalley/exercise-manager'

const moduleProviderLoaders = import.meta.glob<ModuleProviderComponent>('../../modules/*/index.ts', { import: 'ModuleProvider' })

// Load module providers independently of the exercise definitions.
export const moduleProviders = Object.fromEntries(Object.entries(moduleProviderLoaders).map(([path, load]) => {
	const moduleId = path.split('/').slice(-2)[0]
	return [moduleId, lazy(async () => ({ default: await load() }))]
}))
