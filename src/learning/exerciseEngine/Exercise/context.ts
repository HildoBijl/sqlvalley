import { createContext, useContext } from 'react';

import type { StoredExerciseAction, StoredExerciseState } from '@/store';
import type { ExerciseContextValue } from './types';

export type AnyExerciseContextValue = ExerciseContextValue<
  Record<string, unknown>,
  StoredExerciseAction,
  StoredExerciseState
>;

export const ExerciseContext = createContext<AnyExerciseContextValue | null>(null);

/** Access the current exercise (definition, data, controls, skill) from within an <Exercise>. */
export function useExercise<
  Parameters extends Record<string, unknown> = Record<string, unknown>,
  Action extends StoredExerciseAction = StoredExerciseAction,
  State extends StoredExerciseState = StoredExerciseState,
>(): ExerciseContextValue<Parameters, Action, State> {
  const value = useContext(ExerciseContext);
  if (!value) {
    throw new Error('useExercise must be used within an Exercise component.');
  }
  return value as unknown as ExerciseContextValue<Parameters, Action, State>;
}
