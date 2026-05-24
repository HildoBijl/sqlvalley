import { EXERCISES_TO_COMPLETE } from '@/constants';
import {
  getPrerequisites,
  type Module,
  type SkillTree,
} from '@/learning/skillTreeDefinition';
import type { ModuleState, SkillModuleState } from '@/store';

import type { ProcessedModuleCompletion, RawModuleCompletion } from './types';

function getSkillSolvedCount(moduleState: ModuleState | undefined): number {
  const solved = (moduleState as Partial<SkillModuleState> | undefined)?.numSolved;
  return typeof solved === 'number' ? solved : 0;
}

function isUnderstood(moduleState: ModuleState | undefined): boolean {
  return moduleState?.understood === true;
}

function getModules<Id extends string>(skillTree: SkillTree<Id>): Module<Id>[] {
  return Object.values(skillTree) as Module<Id>[];
}

export function getRawModuleCompletion<Id extends string>(
  skillTree: SkillTree<Id>,
  moduleStates: Record<string, ModuleState>,
  requiredCount: number = EXERCISES_TO_COMPLETE,
): RawModuleCompletion<Id> {
  const completed = new Set<Id>();
  const skillProgress: Partial<Record<Id, number>> = {};

  for (const module of getModules(skillTree)) {
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

export function processModuleCompletion<Id extends string>(
  skillTree: SkillTree<Id>,
  rawCompletion: RawModuleCompletion<Id>,
): ProcessedModuleCompletion<Id> {
  const completed = new Set(rawCompletion.completed);

  for (const moduleId of rawCompletion.completed) {
    for (const prerequisiteId of getPrerequisites(skillTree, moduleId)) {
      completed.add(prerequisiteId);
    }
  }

  return {
    ...rawCompletion,
    completed,
  };
}

export function getProcessedModuleCompletion<Id extends string>(
  skillTree: SkillTree<Id>,
  moduleStates: Record<string, ModuleState>,
  requiredCount: number = EXERCISES_TO_COMPLETE,
): ProcessedModuleCompletion<Id> {
  return processModuleCompletion(
    skillTree,
    getRawModuleCompletion(skillTree, moduleStates, requiredCount),
  );
}
