import { type ModuleId, type ModuleTree, getModule } from '@step-wise/module-tree-definition'

import { getGoalPath } from './moduleTree'

export interface GoalProgress {
	completedCount: number
	totalCount: number
	nextStepId: ModuleId | null
}

export function arePrerequisitesCompleted(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	isCompleted: (id: ModuleId) => boolean,
): boolean {
	return getModule(moduleTree, moduleId).prerequisiteIds.every(isCompleted)
}

// A module is ready to learn when it is incomplete and all direct prerequisites are complete.
export function isReadyToLearn(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	isCompleted: (id: ModuleId) => boolean,
): boolean {
	return !isCompleted(moduleId) && arePrerequisitesCompleted(moduleTree, moduleId, isCompleted)
}

export function getGoalProgress(
	moduleTree: ModuleTree,
	goalId: ModuleId,
	isCompleted: (id: ModuleId) => boolean,
): GoalProgress {
	const path = [...getGoalPath(moduleTree, goalId)]
	return {
		completedCount: path.filter(isCompleted).length,
		totalCount: path.length,
		nextStepId: path.find(id => isReadyToLearn(moduleTree, id, isCompleted)) ?? null,
	}
}
