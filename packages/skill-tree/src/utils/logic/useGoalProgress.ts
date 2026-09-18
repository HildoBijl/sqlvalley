import { useEffect, useMemo } from 'react'

import { type ModuleId, type ModuleTree, getRequiredModuleIds } from '@step-wise/module-tree-definition'
import { getGoalProgress } from '@sqlvalley/progress'

/*
 * Track progress towards the planning-mode goal.
 * Returns the set of modules on the goal path (prerequisites plus the goal
 * itself), and reports progress updates through onGoalProgressChange.
 */
export function useGoalProgress(
	goalNodeId: ModuleId | null | undefined,
	moduleTree: ModuleTree,
	modulePresentation: Record<ModuleId, { name: string }>,
	isCompleted: (id: ModuleId) => boolean,
	onGoalProgressChange?: (
		completedCount: number,
		totalCount: number,
		nextStepName: string | null,
		nextStepId: ModuleId | null,
	) => void,
): Set<ModuleId> {
	const goalPath = useMemo(
		() => new Set(goalNodeId ? getRequiredModuleIds(moduleTree, [goalNodeId]) : []),
		[goalNodeId, moduleTree],
	);

	useEffect(() => {
		if (onGoalProgressChange && goalNodeId) {
			const { completedCount, totalCount, nextStepId } =
				getGoalProgress(moduleTree, goalNodeId, isCompleted);
			const nextStepName = nextStepId ? modulePresentation[nextStepId]?.name ?? null : null
			onGoalProgressChange(completedCount, totalCount, nextStepName, nextStepId);
		}
	}, [goalNodeId, isCompleted, modulePresentation, moduleTree, onGoalProgressChange]);

	return goalPath;
}
