import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'

import type { ModulePositioning } from '../positioning/index.ts'

// All data about the skill tree needed to show it.
export interface SkillTreeData {
	moduleTree: ModuleTree
	modulePositioning: ModulePositioning
	modulePresentation: ModulePresentation
}

// Module presentation: what's needed for language-wise names/descriptions of modules.
export interface ModulePresentationData {
	name: string
	description: string
}
export type ModulePresentation = Record<ModuleId, ModulePresentationData>

