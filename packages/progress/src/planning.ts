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

// Within a given subtree of the full module tree, find the most suitable module to study next.
export function getNextModuleId(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	treeModuleIds: ReadonlySet<ModuleId>,
	isModuleCompleted: (id: ModuleId) => boolean,
	goalModuleId?: ModuleId,
): ModuleId | undefined {
	const moduleIdsInTreeOrder = Object.values(moduleTree).map(module => module.id)

	// First search within the requirements of a valid goal.
	const goal = goalModuleId && treeModuleIds.has(goalModuleId) && !isModuleCompleted(goalModuleId) ? goalModuleId : undefined
	if (goal) {
		const goalRequirementIds = new Set(getRequiredModuleIds(moduleTree, [goal]).filter(id => treeModuleIds.has(id)))
		const nextGoalModuleId = findNextModuleId(moduleTree, moduleId, goalRequirementIds, moduleIdsInTreeOrder, isModuleCompleted)
		if (nextGoalModuleId) return nextGoalModuleId
	}

	// If the goal gives no viable route, search the full supplied tree.
	return findNextModuleId(moduleTree, moduleId, treeModuleIds, moduleIdsInTreeOrder, isModuleCompleted)
}

// From a given module ID, find the next module to study within a given set of allowed modules, prioritizing prerequisites and then continuations.
function findNextModuleId(
	moduleTree: ModuleTree,
	moduleId: ModuleId,
	allowedModuleIds: ReadonlySet<ModuleId>,
	moduleIdsInTreeOrder: ModuleId[],
	isModuleCompleted: (id: ModuleId) => boolean,
): ModuleId | undefined {
	let prerequisiteLayer = [moduleId]
	const visitedPrerequisiteIds = new Set(prerequisiteLayer)

	// Minimize prerequisite distance first, then continuation distance.
	while (prerequisiteLayer.length > 0) {
		let continuationLayer = prerequisiteLayer
		const visitedContinuationIds = new Set(continuationLayer)

		while (continuationLayer.length > 0) {
			continuationLayer = getNextLayer(moduleTree, continuationLayer, 'continuationIds', allowedModuleIds, visitedContinuationIds)
			const nextModuleId = chooseSubgoalStep(moduleTree, continuationLayer, allowedModuleIds, moduleIdsInTreeOrder, isModuleCompleted)
			if (nextModuleId) return nextModuleId
		}

		prerequisiteLayer = getNextLayer(moduleTree, prerequisiteLayer, 'prerequisiteIds', allowedModuleIds, visitedPrerequisiteIds)
	}

	// Disconnected modules cannot be reached through the current module, so fall back to the first ready module in tree order.
	return moduleIdsInTreeOrder.find(id => allowedModuleIds.has(id) && isReadyToLearn(moduleTree, id, isModuleCompleted))
}

// From a given set of modules, find the next layer of modules in a given direction (prerequisites or continuations) that are allowed and not yet visited.
function getNextLayer(
	moduleTree: ModuleTree,
	moduleIds: ModuleId[],
	direction: 'prerequisiteIds' | 'continuationIds',
	allowedModuleIds: ReadonlySet<ModuleId>,
	visitedModuleIds: Set<ModuleId>,
): ModuleId[] {
	const nextModuleIds: ModuleId[] = []
	for (const moduleId of moduleIds) {
		for (const nextModuleId of getModule(moduleTree, moduleId)[direction]) {
			if (!allowedModuleIds.has(nextModuleId) || visitedModuleIds.has(nextModuleId)) continue
			visitedModuleIds.add(nextModuleId)
			nextModuleIds.push(nextModuleId)
		}
	}
	return nextModuleIds
}

// From a given set of candidate modules, choose the one that is closest to being ready to learn (fewest missing prerequisites) and return the next step toward it.
function chooseSubgoalStep(
	moduleTree: ModuleTree,
	candidateIds: ModuleId[],
	allowedModuleIds: ReadonlySet<ModuleId>,
	moduleIdsInTreeOrder: ModuleId[],
	isModuleCompleted: (id: ModuleId) => boolean,
): ModuleId | undefined {
	const candidates = new Set(candidateIds.filter(id => !isModuleCompleted(id)))
	let bestStepId: ModuleId | undefined
	let bestSubgoalIsSkill = false
	let fewestMissingRequirements = Infinity

	// Walk through the candidates (in tree order) to find the one with the fewest missing prerequisites and return the next step toward it.
	for (const candidateId of moduleIdsInTreeOrder) {
		if (!candidates.has(candidateId)) continue
		const requiredModuleIds = getRequiredModuleIds(moduleTree, [candidateId])
		const nextStepId = moduleIdsInTreeOrder.find(id => allowedModuleIds.has(id) && requiredModuleIds.includes(id) && isReadyToLearn(moduleTree, id, isModuleCompleted))
		if (!nextStepId) continue
		const subgoalIsSkill = getModule(moduleTree, candidateId).type === 'skill'
		const missingRequirementCount = requiredModuleIds.filter(id => !isModuleCompleted(id)).length
		if (bestStepId && bestSubgoalIsSkill && !subgoalIsSkill) continue
		if (bestStepId && bestSubgoalIsSkill === subgoalIsSkill && missingRequirementCount >= fewestMissingRequirements) continue
		bestSubgoalIsSkill = subgoalIsSkill
		fewestMissingRequirements = missingRequirementCount
		bestStepId = nextStepId
	}
	return bestStepId
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
