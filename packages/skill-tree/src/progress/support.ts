import { type ModuleId, type ModuleTree, getModule } from '@step-wise/module-tree-definition'

import type { IsModuleCompleted } from './types.ts'

// A module is ready to learn when it is incomplete while all its direct prerequisites are complete.
export function isModuleReadyToLearn(moduleTree: ModuleTree, moduleId: ModuleId, isModuleCompleted: IsModuleCompleted) {
	return !isModuleCompleted(moduleId) && getModule(moduleTree, moduleId).prerequisiteIds.every(isModuleCompleted)
}
