import type { SkillTreeModule, SkillTreeModuleRaw } from './types';

export interface ProcessedSkillTreeModules<Id extends string> {
  moduleList: SkillTreeModule<Id>[];
  modules: Record<Id, SkillTreeModule<Id>>;
}

export function processSkillTreeModules<Id extends string>(
  rawModules: readonly SkillTreeModuleRaw<Id>[],
): ProcessedSkillTreeModules<Id> {
  const moduleList: SkillTreeModule<Id>[] = [];
  const modules = {} as Record<Id, SkillTreeModule<Id>>;

  rawModules.forEach((item) => {
    if (modules[item.id]) {
      throw new Error(`Duplicate module ID "${item.id}" encountered.`);
    }

    const processedItem: SkillTreeModule<Id> = {
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      prerequisites: [...item.prerequisites],
      followUps: [],
    };

    moduleList.push(processedItem);
    modules[item.id] = processedItem;
  });

  rawModules.forEach((itemRaw) => {
    const item = modules[itemRaw.id];
    itemRaw.prerequisites.forEach((prerequisiteId) => {
      const prerequisite = modules[prerequisiteId];
      if (!prerequisite) {
        throw new Error(
          `Unknown prerequisite "${prerequisiteId}" encountered at module "${item.id}".`,
        );
      }
      prerequisite.followUps.push(item.id);
    });
  });

  return { moduleList, modules };
}
