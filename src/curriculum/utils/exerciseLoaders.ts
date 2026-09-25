import { getUpdatedExerciseModule } from './exerciseHotReload'

const modules = import.meta.glob('../../modules/*/exercises/index.ts')

export const skillExerciseLoaders: Record<string, () => Promise<unknown>> = Object.fromEntries(
	Object.entries(modules).map(([path, load]) => {
		const skillId = path.split('/').slice(-3)[0]
		return [skillId, async () => {
			const module = await load()
			return import.meta.hot ? getUpdatedExerciseModule(skillId) ?? module : module
		}]
	}),
)
