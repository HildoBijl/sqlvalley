import type { SkillTreeModule } from './types';

export function getPrerequisites<Id extends string>(
  itemId: Id,
  moduleItems: Record<Id, SkillTreeModule<Id>>,
): Set<Id> {
  const prerequisites = new Set<Id>();
  const item = moduleItems[itemId];

  if (!item?.prerequisites.length) {
    return prerequisites;
  }

  for (const prereqId of item.prerequisites) {
    prerequisites.add(prereqId);
    const nestedPrerequisites = getPrerequisites(prereqId, moduleItems);
    for (const nestedPrereqId of nestedPrerequisites) {
      prerequisites.add(nestedPrereqId);
    }
  }

  return prerequisites;
}
