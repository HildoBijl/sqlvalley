import { ensureInteger } from '@step-wise/js-utils'
import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'

import { getTransitivePrerequisiteIds } from './moduleTree'

// Exercises a learner must solve before a skill counts as completed.
export const EXERCISES_REQUIRED_FOR_SKILL_COMPLETION = 3

// The module-based object from which completion data is derived.
export interface ModuleCompletionState {
	understood?: boolean
	solvedExerciseCount?: number
}

// Determine the set of modules that has been completed.
export function getCompletedModuleIds(
	moduleTree: ModuleTree,
	moduleStates: Record<ModuleId, ModuleCompletionState>,
	requiredExerciseCount: number = EXERCISES_REQUIRED_FOR_SKILL_COMPLETION,
): Set<ModuleId> {
	requiredExerciseCount = ensureInteger(requiredExerciseCount, { nonNegative: true, nonZero: true })
	const directlyCompletedModuleIds = getDirectlyCompletedModuleIds(moduleTree, moduleStates, requiredExerciseCount)
	return includeCompletedPrerequisites(moduleTree, directlyCompletedModuleIds)
}

// Determine the set of all modules whose data directly shows they are completed.
function getDirectlyCompletedModuleIds(
	moduleTree: ModuleTree,
	moduleStates: Record<ModuleId, ModuleCompletionState>,
	requiredExerciseCount: number,
): Set<ModuleId> {
	const completedModuleIds = new Set<ModuleId>()
	for (const module of Object.values(moduleTree)) {
		const moduleState = moduleStates[module.id]
		if (isModuleUnderstood(moduleState) || (module.type === 'skill' && getSolvedExerciseCount(moduleState) >= requiredExerciseCount)) completedModuleIds.add(module.id)
	}
	return completedModuleIds
}

// Take a set of module IDs and add all their prerequisites.
function includeCompletedPrerequisites(
	moduleTree: ModuleTree,
	directlyCompletedModuleIds: Set<ModuleId>,
): Set<ModuleId> {
	const completedModuleIds = new Set(directlyCompletedModuleIds)
	for (const moduleId of directlyCompletedModuleIds) {
		for (const prerequisiteId of getTransitivePrerequisiteIds(moduleTree, moduleId)) {
			completedModuleIds.add(prerequisiteId)
		}
	}
	return completedModuleIds
}

// Normalize the solvedExercise count.
function getSolvedExerciseCount(moduleState: ModuleCompletionState | undefined): number {
	const solvedExerciseCount = moduleState?.solvedExerciseCount
	return solvedExerciseCount === undefined ? 0 : ensureInteger(solvedExerciseCount, { nonNegative: true })
}

// Normalize the understood flag.
function isModuleUnderstood(moduleState: ModuleCompletionState | undefined): boolean {
	return moduleState?.understood === true
}
