import { type ComponentType, type LazyExoticComponent, lazy } from 'react'

import type { ModuleProviderComponent } from '@sqlvalley/exercise-manager'

const moduleProviderLoaders = import.meta.glob<ModuleProviderComponent>('../../modules/*/index.ts', { import: 'ModuleProvider' })

// Load module providers independently of the exercise definitions.
export const moduleProviders = Object.fromEntries(Object.entries(moduleProviderLoaders).map(([path, load]) => {
	const moduleId = path.split('/').slice(-2)[0]
	return [moduleId, lazy(async () => ({ default: await load() }))]
}))

export type ModuleComponentMap = Record<string, LazyExoticComponent<ComponentType<any>>>;

const ALLOWED_MODULE_SECTIONS = new Set(['Theory', 'Summary', 'Story', 'Video', 'Practice']);

type ComponentModule = {
	default?: ComponentType<any>;
} & Record<string, ComponentType<any> | undefined>;

const moduleComponentModules = import.meta.glob('../../modules/*/*.tsx') as Record<
	string,
	() => Promise<Record<string, unknown>>
>;

function createLazyComponent(
	loader: () => Promise<Record<string, unknown>>,
	exportName: string,
	modulePath: string,
): LazyExoticComponent<ComponentType<any>> {
	return lazy(async () => {
		const module = (await loader()) as ComponentModule;
		const component = module[exportName] ?? module.default;
		if (!component) {
			throw new Error(`Component "${exportName}" not found in module "${modulePath}".`);
		}
		return { default: component };
	});
}

export const moduleComponents: Record<string, ModuleComponentMap> = Object.entries(
	moduleComponentModules,
).reduce<Record<string, ModuleComponentMap>>((acc, [path, loader]) => {
	const match = path.match(/\.\.\/\.\.\/modules\/([^/]+)\/([^/]+)\.tsx$/);
	if (!match) {
		return acc;
	}

	const [, moduleId, section] = match;
	if (!ALLOWED_MODULE_SECTIONS.has(section)) {
		return acc;
	}

	const entry = acc[moduleId] ?? (acc[moduleId] = {} as ModuleComponentMap);
	entry[section] = createLazyComponent(loader, section, path);

	return acc;
}, {});
