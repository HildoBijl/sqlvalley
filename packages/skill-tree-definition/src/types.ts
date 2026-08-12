export type ModuleType = 'concept' | 'skill';

export interface ModuleRaw<Id extends string = string> {
  id: Id;
  name: string;
  type: ModuleType;
  description: string;
  prerequisites: readonly Id[];
}

export interface Module<Id extends string = string>
  extends Omit<ModuleRaw<Id>, 'prerequisites'> {
  prerequisites: Id[];
  followUps: Id[];
}

export type SkillTree<Id extends string = string> = Record<Id, Module<Id>>;
