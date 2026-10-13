import type { ModuleId } from '@step-wise/module-tree-definition'

export type IsModuleCompleted = (id: ModuleId) => boolean

export interface SkillTreeProgress {
	isCompleted: IsModuleCompleted
	hasProgress: boolean
}
