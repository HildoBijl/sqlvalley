import type { ReactNode } from 'react';

import type {
  StoredExerciseAction,
  StoredExerciseEvent,
  StoredExerciseInstance,
  StoredExerciseState,
} from '@/store';

export interface ExerciseHelpers {
  selectRandomly<T>(items: readonly T[]): T;
  randomInt(min: number, max: number): number;
}

export interface ExerciseDescriptor<Parameters extends Record<string, unknown>> {
  exerciseId: string;
  version: number;
  parameters: Parameters;
}

export type ExerciseReducer<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
> = (args: {
  parameters: Parameters;
  action: Action;
  previousState: State;
}) => State;

export interface ExerciseSessionOptions<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
> {
  skillId: string;
  reducer: ExerciseReducer<Parameters, Action, State>;
  initialState: State;
  isComplete: (state: State) => boolean;
  isSolved: (state: State) => boolean;
}

export interface ExerciseContextValue<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
> {
  skillId: string;
  descriptor: ExerciseDescriptor<Parameters> | null;
  instance: StoredExerciseInstance | null;
  state: State;
  events: StoredExerciseEvent[];
  parameters: Parameters | null;
  draftInput: unknown;
  startExercise: (descriptor: ExerciseDescriptor<Parameters>) => void;
  submitAction: (action: Action) => State;
  setDraftInput: (draftInput: unknown) => void;
}

export interface ExerciseProps<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
> extends ExerciseSessionOptions<Parameters, Action, State> {
  children: ReactNode;
}
