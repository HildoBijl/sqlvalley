import type { Module, SkillTree } from './types';

export function getModules<Id extends string>(skillTree: SkillTree<Id>): Module<Id>[] {
  return Object.values(skillTree) as Module<Id>[];
}

export function getPrerequisites<Id extends string>(
  skillTree: SkillTree<Id>,
  moduleId: Id,
): Set<Id> {
  const prerequisites = new Set<Id>();
  const module = skillTree[moduleId];

  if (!module?.prerequisites.length) {
    return prerequisites;
  }

  for (const prereqId of module.prerequisites) {
    prerequisites.add(prereqId);
    const nestedPrerequisites = getPrerequisites(skillTree, prereqId);
    for (const nestedPrereqId of nestedPrerequisites) {
      prerequisites.add(nestedPrereqId);
    }
  }

  return prerequisites;
}
