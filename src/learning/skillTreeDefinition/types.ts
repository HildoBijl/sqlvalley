export type SkillTreeModuleType = 'concept' | 'skill';

export interface SkillTreeModuleRaw<Id extends string = string> {
  id: Id;
  name: string;
  type: SkillTreeModuleType;
  description: string;
  prerequisites: readonly Id[];
}

export interface SkillTreeModule<Id extends string = string>
  extends Omit<SkillTreeModuleRaw<Id>, 'prerequisites'> {
  prerequisites: Id[];
  followUps: Id[];
}
