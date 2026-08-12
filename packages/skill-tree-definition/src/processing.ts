import type { Module, ModuleRaw, SkillTree } from './types';

export function processSkillTreeModules<Id extends string>(
  rawModules: readonly ModuleRaw<Id>[],
): SkillTree<Id> {
  const skillTree = {} as SkillTree<Id>;

  rawModules.forEach((item) => {
    if (skillTree[item.id]) {
      throw new Error(`Duplicate module ID "${item.id}" encountered.`);
    }

    const processedModule: Module<Id> = {
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      prerequisites: [...item.prerequisites],
      followUps: [],
    };

    skillTree[item.id] = processedModule;
  });

  rawModules.forEach((itemRaw) => {
    const item = skillTree[itemRaw.id];
    itemRaw.prerequisites.forEach((prerequisiteId) => {
      const prerequisite = skillTree[prerequisiteId];
      if (!prerequisite) {
        throw new Error(
          `Unknown prerequisite "${prerequisiteId}" encountered at module "${item.id}".`,
        );
      }
      prerequisite.followUps.push(item.id);
    });
  });

  return skillTree;
}
