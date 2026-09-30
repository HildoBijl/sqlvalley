import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { getUpdatedExerciseModule } from './exerciseHotReload'

export interface ExerciseModule {
	default: (moduleId: string) => ExerciseRegistration[]
}

const modules = import.meta.glob<ExerciseModule>('../../modules/*/exercises/index.ts')

export const skillExerciseLoaders: Partial<Record<string, () => Promise<ExerciseModule>>> = Object.fromEntries(
	Object.entries(modules).map(([path, load]) => {
		const moduleId = path.split('/').slice(-3)[0]
		return [moduleId, async () => {
			const original = await load()
			const module = (import.meta.hot ? getUpdatedExerciseModule(moduleId) : undefined) ?? original
			if (typeof module.default !== 'function') throw new Error(`Exercise module "${moduleId}" has no default builder export.`)
			return module
		}]
	}),
)
