import { type ComponentType, type LazyExoticComponent, lazy } from 'react'

import type { ModuleContent } from '@/learning'

interface StaticPracticeProps {
	onComplete: () => void
	isCompleted: boolean
}

export type ModuleComponentMap = ModuleContent & {
	Practice?: LazyExoticComponent<ComponentType<StaticPracticeProps>>
}

const ALLOWED_MODULE_SECTIONS = new Set(['Theory', 'Summary', 'Story', 'Video', 'Practice'])

type ComponentModule<Props extends object> = Partial<Record<string, ComponentType<Props>>>

const moduleComponentModules = import.meta.glob('../../modules/*/*.tsx') as Record<string, () => Promise<Record<string, unknown>>>

function createLazyComponent<Props extends object>(
	loader: () => Promise<Record<string, unknown>>,
	exportName: string,
	modulePath: string,
): LazyExoticComponent<ComponentType<Props>> {
	return lazy(async () => {
		const module = (await loader()) as ComponentModule<Props>
		const component = module[exportName] ?? module.default
		if (!component) {
			throw new Error(`Component "${exportName}" not found in module "${modulePath}".`)
		}
		return { default: component }
	})
}

export const moduleComponents: Record<string, ModuleComponentMap> = Object.entries(moduleComponentModules).reduce<Record<string, ModuleComponentMap>>((acc, [path, loader]) => {
	const match = path.match(/\.\.\/\.\.\/modules\/([^/]+)\/([^/]+)\.tsx$/)
	if (!match) return acc

	const [, moduleId, section] = match
	if (!ALLOWED_MODULE_SECTIONS.has(section)) return acc

	const entry = acc[moduleId] ?? (acc[moduleId] = {} as ModuleComponentMap)
	if (section === 'Practice') entry.Practice = createLazyComponent<StaticPracticeProps>(loader, section, path)
	else if (section === 'Theory' || section === 'Summary' || section === 'Story' || section === 'Video') entry[section] = createLazyComponent<Record<string, never>>(loader, section, path)

	return acc
}, {})
