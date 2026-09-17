import { useEffect, useMemo } from 'react';
import { getGoalPath, getGoalProgress } from '@sqlvalley/progress'
import type { ModuleTree } from '@step-wise/module-tree-definition'

/*
 * Track progress towards the planning-mode goal.
 * Returns the set of modules on the goal path (prerequisites plus the goal
 * itself), and reports progress updates through onGoalProgressChange.
 */
export function useGoalProgress(
  goalNodeId: string | null | undefined,
  moduleTree: ModuleTree,
  modulePresentation: Record<string, { name: string }>,
  isCompleted: (id: string) => boolean,
  onGoalProgressChange?: (
    completedCount: number,
    totalCount: number,
    nextStepName: string | null,
    nextStepId: string | null,
  ) => void,
): Set<string> {
  const goalPath = useMemo(
    () => (goalNodeId ? getGoalPath(moduleTree, goalNodeId) : new Set<string>()),
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
