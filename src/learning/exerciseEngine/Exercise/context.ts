import { createContext, useContext } from 'react';

import type { StoredExerciseAction, StoredExerciseState } from '@/store';
import type { ExerciseContextValue } from './types';

/**
 * The context value with its generic parameters erased to their widest form.
 * A single React context cannot stay generic, so the provider stores this
 * shape and useExercise re-narrows it for each caller.
 */
export type AnyExerciseContextValue = ExerciseContextValue<
  Record<string, unknown>,
  StoredExerciseAction,
  StoredExerciseState
>;

export const ExerciseContext = createContext<AnyExerciseContextValue | null>(null);

/** Access the current exercise session from within an <Exercise> subtree. */
export function useExercise<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
>(): ExerciseContextValue<Parameters, Action, State> {
  const value = useContext(ExerciseContext);
  if (!value) {
    throw new Error('useExercise must be used within an Exercise component.');
  }
  return value as unknown as ExerciseContextValue<Parameters, Action, State>;
}
