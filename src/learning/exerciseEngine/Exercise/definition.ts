import type { ComponentType } from 'react';

import type { StoredExerciseAction, StoredExerciseState } from '@/store';
import type { ExerciseHelpers } from './types';

export type AsyncExerciseReducer<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
> = (args: {
  parameters: Parameters;
  action: Action;
  previousState: State;
}) => Promise<{ state: State; feedback?: unknown }>;

/**
 * A single self-contained exercise: how to generate it, how to reduce an action
 * against its state, and the component that renders it (props-free, context-fed).
 */
export interface ExerciseDefinition<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
> {
  exerciseId: string;
  version: number;
  generateParameters: (
    helpers: ExerciseHelpers,
    context?: { previousParameters?: Parameters | null },
  ) => Parameters;
  reduce: AsyncExerciseReducer<Parameters, Action, State>;
  initialState: State;
  isComplete: (state: State) => boolean;
  isSolved: (state: State) => boolean;
  Component: ComponentType;
}

/** An exercise definition with its generics erased, for holding a mixed list. */
export type AnyExerciseDefinition = ExerciseDefinition<
  Record<string, unknown>,
  StoredExerciseAction,
  StoredExerciseState
>;
