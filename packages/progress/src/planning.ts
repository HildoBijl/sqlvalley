import { type ModuleId, type ModuleTree, getModule } from '@step-wise/module-tree-definition'

import { getGoalPathModuleIds } from './moduleTree'

export interface GoalProgress {
	completedCount: number
	totalCount: number
	nextStepId: ModuleId | null
}

export function areDirectPrerequisitesCompleted(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	isModuleCompleted: (id: ModuleId) => boolean,
): boolean {
	return getModule(moduleTree, moduleId).prerequisiteIds.every(isModuleCompleted)
}

// A module is ready to learn when it is incomplete and all direct prerequisites are complete.
export function isReadyToLearn(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	isModuleCompleted: (id: ModuleId) => boolean,
): boolean {
	return !isModuleCompleted(moduleId) &&
		areDirectPrerequisitesCompleted(moduleTree, moduleId, isModuleCompleted)
}

export function getGoalProgress(
	moduleTree: ModuleTree,
	goalId: ModuleId,
	isModuleCompleted: (id: ModuleId) => boolean,
): GoalProgress {
	const goalPathModuleIds = [...getGoalPathModuleIds(moduleTree, goalId)]
	return {
		completedCount: goalPathModuleIds.filter(isModuleCompleted).length,
		totalCount: goalPathModuleIds.length,
		nextStepId:
			goalPathModuleIds.find(id => isReadyToLearn(moduleTree, id, isModuleCompleted)) ?? null,
	}
}
