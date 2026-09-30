import type { ComponentType, LazyExoticComponent } from 'react'

export type ModuleContentComponent = ComponentType | LazyExoticComponent<ComponentType>

export interface ModuleContent {
	Theory?: ModuleContentComponent
	Summary?: ModuleContentComponent
	Story?: ModuleContentComponent
	Video?: ModuleContentComponent
}
