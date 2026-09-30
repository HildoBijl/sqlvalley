import { getRequiredModuleIds } from '@step-wise/module-tree-definition'
import { areDirectPrerequisitesCompleted, isReadyToLearn } from '@sqlvalley/progress'

import { type ModuleId, isModuleId, moduleTree } from './moduleDefinition'

export function getNextModuleIds(moduleId: ModuleId, treeModuleIds: ReadonlySet<string>, isCompleted: (id: string) => boolean, goalNodeId?: string | null): string[] {
	const goal = goalNodeId && isModuleId(goalNodeId) && treeModuleIds.has(goalNodeId) ? goalNodeId : undefined
	if (goal && isReadyToLearn(moduleTree, goal, isCompleted)) return [goal]
	const goalPath = goal ? new Set(getRequiredModuleIds(moduleTree, [goal])) : undefined
	return moduleTree[moduleId].continuationIds.filter(id =>
		treeModuleIds.has(id) && (!goalPath || goalPath.has(id)) && areDirectPrerequisitesCompleted(moduleTree, id, isCompleted))
}
