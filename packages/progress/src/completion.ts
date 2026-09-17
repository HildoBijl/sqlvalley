import { ensureInteger } from '@step-wise/js-utils'
import type { ModuleTree } from '@step-wise/module-tree-definition'

import { getTransitivePrerequisiteIds } from './moduleTree'

export interface ModuleCompletionState {
	understood?: boolean
	solvedExerciseCount?: number
}

// Exercises a learner must solve before a skill counts as completed.
export const EXERCISES_REQUIRED_FOR_SKILL_COMPLETION = 3

function getSolvedExerciseCount(moduleState: ModuleCompletionState | undefined): number {
	const solvedExerciseCount = moduleState?.solvedExerciseCount
	return solvedExerciseCount === undefined
		? 0
		: ensureInteger(solvedExerciseCount, { nonNegative: true })
}

function isModuleUnderstood(moduleState: ModuleCompletionState | undefined): boolean {
	return moduleState?.understood === true
}

function getDirectlyCompletedModuleIds(
	moduleTree: ModuleTree,
	moduleStates: Record<string, ModuleCompletionState>,
	requiredExerciseCount: number,
): Set<string> {
	const completedModuleIds = new Set<string>()

	for (const module of Object.values(moduleTree)) {
		const moduleState = moduleStates[module.id]
		if (isModuleUnderstood(moduleState)) {
			completedModuleIds.add(module.id)
			continue
		}

		if (
			module.type === 'skill' &&
			getSolvedExerciseCount(moduleState) >= requiredExerciseCount
		) completedModuleIds.add(module.id)
	}

	return completedModuleIds
}

function includeCompletedPrerequisites(
	moduleTree: ModuleTree,
	directlyCompletedModuleIds: Set<string>,
): Set<string> {
	const completedModuleIds = new Set(directlyCompletedModuleIds)

	// Mastering a module demonstrates mastery of all the knowledge it builds on.
	for (const moduleId of directlyCompletedModuleIds) {
		for (const prerequisiteId of getTransitivePrerequisiteIds(moduleTree, moduleId)) {
			completedModuleIds.add(prerequisiteId)
		}
	}

	return completedModuleIds
}

export function getCompletedModuleIds(
	moduleTree: ModuleTree,
	moduleStates: Record<string, ModuleCompletionState>,
	requiredExerciseCount: number = EXERCISES_REQUIRED_FOR_SKILL_COMPLETION,
): Set<string> {
	requiredExerciseCount = ensureInteger(requiredExerciseCount, { nonNegative: true, nonZero: true })
	const directlyCompletedModuleIds = getDirectlyCompletedModuleIds(
		moduleTree,
		moduleStates,
		requiredExerciseCount,
	)
	return includeCompletedPrerequisites(moduleTree, directlyCompletedModuleIds)
}
