import {
	type ModuleId,
	type ModuleTree,
	getModule,
	getModuleIdsBetweenGoalsAndPriorKnowledge,
} from '@step-wise/module-tree-definition'

// Potential module-tree-definition additions: getPrerequisiteIds and getGoalPath.
// Return all transitive prerequisites of a module, excluding the module itself.
export function getPrerequisiteIds(moduleTree: ModuleTree, moduleId: ModuleId): Set<ModuleId> {
	const moduleIds = getModuleIdsBetweenGoalsAndPriorKnowledge(moduleTree, [moduleId], [])
	return new Set(moduleIds.filter(id => id !== moduleId))
}

// Return a goal and all of its transitive prerequisites.
export function getGoalPath(moduleTree: ModuleTree, goalId: ModuleId): Set<ModuleId> {
	return new Set(getModuleIdsBetweenGoalsAndPriorKnowledge(moduleTree, [goalId], []))
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

export interface GoalProgress {
	completedCount: number
	totalCount: number
	nextStepId: ModuleId | null
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
