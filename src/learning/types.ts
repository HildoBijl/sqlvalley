import type { ComponentType, LazyExoticComponent } from 'react'

import type { ModuleProviderComponent } from '@sqlvalley/exercise-manager'

export type ModuleContentComponent<Props extends object = Record<string, never>> = ComponentType<Props> | LazyExoticComponent<ComponentType<Props>>

export type ModuleContentSection = 'Theory' | 'Summary' | 'Story' | 'Video'

export interface ModuleContent {
	Theory?: ModuleContentComponent
	Summary?: ModuleContentComponent
	Story?: ModuleContentComponent<StoryProps>
	Video?: ModuleContentComponent
	Practice?: ModuleContentComponent<StaticPracticeComponentProps>
}

export interface StoryProps {
	completed: boolean
}

export interface StaticPracticeComponentProps {
	onComplete: () => void
	isCompleted: boolean
}

export type ModuleImplementation = ModuleContent & {
	ModuleProvider: ModuleProviderComponent
}
