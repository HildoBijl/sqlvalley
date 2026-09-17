import type { ModuleTree } from '@step-wise/module-tree-definition'

import type {
  ModuleCompletion,
  ModuleProgressState,
  RawModuleCompletion,
} from './types'
import { getPrerequisiteIds } from './moduleTree'

/** Exercises a learner must solve before a skill counts as mastered. */
export const DEFAULT_EXERCISES_TO_COMPLETE = 3;

function getSkillSolvedCount(moduleState: ModuleProgressState | undefined): number {
  const solved = moduleState?.solvedExerciseCount;
  return typeof solved === 'number' ? solved : 0;
}

function isUnderstood(moduleState: ModuleProgressState | undefined): boolean {
  return moduleState?.understood === true;
}

export function getRawModuleCompletion(
  moduleTree: ModuleTree,
  moduleStates: Record<string, ModuleProgressState>,
  requiredCount: number = DEFAULT_EXERCISES_TO_COMPLETE,
): RawModuleCompletion {
  const completed = new Set<string>();
  const skillProgress: Partial<Record<string, number>> = {};

  for (const module of Object.values(moduleTree)) {
    const moduleState = moduleStates[module.id];

    if (module.type === 'concept') {
      if (isUnderstood(moduleState)) {
        completed.add(module.id);
      }
      continue;
    }

    const solved = getSkillSolvedCount(moduleState);
    if (solved > 0) {
      skillProgress[module.id] = solved;
    }
    if (isUnderstood(moduleState) || solved >= requiredCount) {
      completed.add(module.id);
    }
  }

  return { completed, skillProgress, requiredCount };
}

export function processModuleCompletion(
  moduleTree: ModuleTree,
  rawCompletion: RawModuleCompletion,
): ModuleCompletion {
  const completed = new Set(rawCompletion.completed);

  for (const moduleId of rawCompletion.completed) {
    for (const prerequisiteId of getPrerequisiteIds(moduleTree, moduleId)) {
      completed.add(prerequisiteId);
    }
  }

  return {
    ...rawCompletion,
    completed,
  };
}

export function getProcessedModuleCompletion(
  moduleTree: ModuleTree,
  moduleStates: Record<string, ModuleProgressState>,
  requiredCount: number = DEFAULT_EXERCISES_TO_COMPLETE,
): ModuleCompletion {
  return processModuleCompletion(
    moduleTree,
    getRawModuleCompletion(moduleTree, moduleStates, requiredCount),
  );
}
