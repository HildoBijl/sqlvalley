/**
 * Exercise ids and the stored action/state log. The store persists these, the
 * engine defines them.
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
  // Opaque per-exercise-type data for rebuilding feedback without regrading.
  report?: unknown;
}

export interface StoredExerciseInstance {
  exerciseId: ExerciseId;
  version: ExerciseVersion;
  parameters: Record<string, unknown>;
  createdAt: number;
  events: StoredExerciseEvent[];
  draftInput: unknown;
}
