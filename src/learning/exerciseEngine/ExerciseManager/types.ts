import type { ReactNode } from 'react';

import type { ExerciseHelpers } from '../Exercise';

/** Minimal shape the manager needs from each exercise it can start. */
export interface ManagedExercise<Parameters extends Record<string, unknown>> {
  exerciseId: string;
  version: number;
  generateParameters: (
    helpers: ExerciseHelpers,
    context?: { previousParameters?: Parameters | null },
  ) => Parameters;
}

export interface ExerciseManagerControls {
  /** Start a fresh random exercise (never the current one when alternatives exist). */
  startNewExercise: () => void;
  /** Start a specific exercise by id. */
  startExercise: (exerciseId: string) => void;
}

export interface ExerciseManagerProps<
  Parameters extends Record<string, unknown>,
  T extends ManagedExercise<Parameters>,
> {
  exercises: ReadonlyArray<T>;
  unavailableMessage?: ReactNode;
  pendingMessage?: ReactNode;
  children: (exercise: T, controls: ExerciseManagerControls) => ReactNode;
}
