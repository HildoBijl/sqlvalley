import type { ComponentType } from 'react';

import type { StoredExerciseState } from '@/store';
import type { ExerciseHelpers } from './types';

/**
 * A single self-contained exercise: how to generate it and the component that
 * renders it (props-free, context-fed).
 */
export interface ExerciseDefinition<
  Parameters extends Record<string, unknown>,
  State extends StoredExerciseState,
> {
  exerciseId: string;
  version: number;
  generateParameters: (
    helpers: ExerciseHelpers,
    context?: { previousParameters?: Parameters | null },
  ) => Parameters;
  initialState: State;
  isComplete: (state: State) => boolean;
  isSolved: (state: State) => boolean;
  Component: ComponentType;
}

/** An exercise definition with its generics erased, for holding a mixed list. */
export type AnyExerciseDefinition = ExerciseDefinition<Record<string, unknown>, StoredExerciseState>;
