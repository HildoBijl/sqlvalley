/**
 * Learning store types.
 */

export type ExerciseId = string;
export type ExerciseVersion = number;
export type SkillId = string;

export type StoredExerciseAction = Record<string, unknown>;
export type StoredExerciseState = Record<string, unknown>;

export interface StoredExerciseEvent {
  timestamp: number;
  action: StoredExerciseAction;
  resultingState: StoredExerciseState;
}

export interface StoredExerciseInstance {
  exerciseId: ExerciseId;
  version: ExerciseVersion;
  parameters: Record<string, unknown>;
  createdAt: number;
  events: StoredExerciseEvent[];
  draftInput: unknown;
}

interface BaseModuleState {
  id: string;
  tab?: string;
  lastAccessed?: number;
  understood?: true;
}

export type ConceptModuleState = BaseModuleState;

export interface SkillModuleState extends BaseModuleState {
  numSolved: number;
  exercises: StoredExerciseInstance[];
  // Transient: an async action is currently being processed for this skill.
  pending?: boolean;
}

export interface ExerciseActionResult {
  state: StoredExerciseState;
  feedback?: unknown;
}

export type AsyncExerciseReducer = (args: {
  parameters: Record<string, unknown>;
  action: StoredExerciseAction;
  previousState: StoredExerciseState;
}) => Promise<ExerciseActionResult>;

export type ModuleState = ConceptModuleState | SkillModuleState;

export type ModuleType = 'concept' | 'skill';

export interface LearningState {
  modules: Record<string, ModuleState>;
}
