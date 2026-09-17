import {
	type ModuleId,
	type ModuleTree,
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
