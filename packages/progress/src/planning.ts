import { type ModuleId, type ModuleTree, getModule, getRequiredModuleIds } from '@step-wise/module-tree-definition'

// Determine if all direct prerequisites of a module are completed.
export function areDirectPrerequisitesCompleted(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	isModuleCompleted: (id: ModuleId) => boolean,
): boolean {
	return getModule(moduleTree, moduleId).prerequisiteIds.every(isModuleCompleted)
}

// Determine if a module is ready to learn: it's incomplete but all its direct prerequisites are complete.
export function isReadyToLearn(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	isModuleCompleted: (id: ModuleId) => boolean,
): boolean {
	return !isModuleCompleted(moduleId) && areDirectPrerequisitesCompleted(moduleTree, moduleId, isModuleCompleted)
}

// Within a given subtree of the full module tree, find a suitable continuation from a given module.
export function getNextModuleIds(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	treeModuleIds: ReadonlySet<ModuleId>,
	isModuleCompleted: (id: ModuleId) => boolean,
	goalModuleId?: ModuleId,
): ModuleId[] {
	// Vertify that the goal is valid. If it can be studied, study it.
	const goal = goalModuleId && treeModuleIds.has(goalModuleId) && !isModuleCompleted(goalModuleId) ? goalModuleId : undefined
	if (goal && isReadyToLearn(moduleTree, goal, isModuleCompleted)) return [goal]

	// Find a continuation of the current module that can be studied next, and (if given a goal) is relevant for the goal.
	const goalRequirements = goal ? new Set(getRequiredModuleIds(moduleTree, [goal])) : undefined
	return getModule(moduleTree, moduleId).continuationIds.filter(id => treeModuleIds.has(id) && (!goalRequirements || goalRequirements.has(id)) && isReadyToLearn(moduleTree, id, isModuleCompleted))
}

// Determine, for a specific module, the progress up its prerequisite tree.
export interface GoalProgress {
	completedCount: number
	totalCount: number
	nextStepId: ModuleId | null
}
export function getGoalProgress(
	moduleTree: ModuleTree,
	goalId: ModuleId,
	isModuleCompleted: (id: ModuleId) => boolean,
): GoalProgress {
	const goalPathModuleIds = getRequiredModuleIds(moduleTree, [goalId])
	return {
		completedCount: goalPathModuleIds.filter(isModuleCompleted).length,
		totalCount: goalPathModuleIds.length,
		nextStepId: goalPathModuleIds.find(id => isReadyToLearn(moduleTree, id, isModuleCompleted)) ?? null,
	}
}
