import { useCallback, useMemo } from 'react';

import type { Module, SkillTree } from '@/learning/skillTreeDefinition';
import { useLearningStore } from '@/store';

import {
  getRawModuleCompletion,
  processModuleCompletion,
} from './logic';

function getModules<Id extends string>(skillTree: SkillTree<Id>): Module<Id>[] {
  return Object.values(skillTree) as Module<Id>[];
}

export function useRawModuleCompletion<Id extends string>(
  skillTree: SkillTree<Id>,
) {
  const moduleStates = useLearningStore((state) => state.modules);

  return useMemo(
    () => getRawModuleCompletion(skillTree, moduleStates),
    [skillTree, moduleStates],
  );
}

export function useProcessedModuleCompletion<Id extends string>(
  skillTree: SkillTree<Id>,
) {
  const rawCompletion = useRawModuleCompletion(skillTree);

  return useMemo(
    () => processModuleCompletion(skillTree, rawCompletion),
    [skillTree, rawCompletion],
  );
}

export function useModuleProgress<Id extends string>(
  skillTree: SkillTree<Id>,
) {
  const modules = useMemo(() => getModules(skillTree), [skillTree]);
  const concepts = useMemo(
    () => modules.filter((module) => module.type === 'concept'),
    [modules],
  );
  const skills = useMemo(
    () => modules.filter((module) => module.type === 'skill'),
    [modules],
  );
  const processed = useProcessedModuleCompletion(skillTree);

  const isCompleted = useCallback(
    (id: string) => processed.completed.has(id as Id),
    [processed],
  );

  const getProgress = useCallback(
    (id: string) => {
      const progress = processed.skillProgress[id as Id];
      if (progress === undefined) return null;
      return `${progress}/${processed.requiredCount}`;
    },
    [processed],
  );

  const completedConcepts = useMemo(
    () =>
      concepts.filter((concept) => processed.completed.has(concept.id)).length,
    [concepts, processed],
  );

  const completedSkills = useMemo(
    () => skills.filter((skill) => processed.completed.has(skill.id)).length,
    [processed, skills],
  );

  return {
    concepts,
    skills,
    isCompleted,
    getProgress,
    completedConcepts,
    completedSkills,
  };
}
