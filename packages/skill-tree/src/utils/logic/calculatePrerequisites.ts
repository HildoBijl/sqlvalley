import { useEffect, useMemo } from 'react';
import type { Module } from '@sqlvalley/skill-tree-definition';
import { getPrerequisites } from '@sqlvalley/skill-tree-definition';

export function useGoalProgress(
  goalNodeId: string | null | undefined,
  skillTree: Record<string, Module>,
  isCompleted: (id: string) => boolean,
  onGoalProgressChange?: (
    completedCount: number,
    totalCount: number,
    nextStepName: string | null,
    nextStepId: string | null,
  ) => void,
): Set<string> {
  const goalPrerequisites = useMemo(() => {
    if (goalNodeId) {
      return getPrerequisites(skillTree, goalNodeId);
    }
    return new Set<string>();
  }, [goalNodeId, skillTree]);

  useEffect(() => {
    if (onGoalProgressChange && goalNodeId) {
      const nodesOnPath = [...Array.from(goalPrerequisites), goalNodeId];
      const totalCount = nodesOnPath.length;
      const completedCount = nodesOnPath.filter((id) => isCompleted(id)).length;

      const nextStep = nodesOnPath.find((id) => {
        if (isCompleted(id)) return false;
        const item = skillTree[id];
        const allPrereqsCompleted =
          item.prerequisites?.every((prereqId) => isCompleted(prereqId)) ??
          true;
        return allPrereqsCompleted;
      });

      const nextStepName = nextStep ? skillTree[nextStep]?.name : null;
      onGoalProgressChange(
        completedCount,
        totalCount,
        nextStepName,
        nextStep ?? null,
      );
    }
  }, [
    goalNodeId,
    goalPrerequisites,
    isCompleted,
    onGoalProgressChange,
    skillTree,
  ]);

  return goalPrerequisites;
}
