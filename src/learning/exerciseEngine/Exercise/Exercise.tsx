import { createContext, useContext } from 'react';

import type { StoredExerciseState } from '@/store';
import type { ExerciseContextValue, ExerciseProps } from './types';
import { useExerciseSession } from './useExerciseSession';

const ExerciseContext = createContext<ExerciseContextValue<any, any, any> | null>(null);

export function Exercise<
  Parameters extends Record<string, unknown>,
  Action,
  State extends StoredExerciseState,
>(props: ExerciseProps<Parameters, Action, State>) {
  const { children, ...options } = props;
  const value = useExerciseSession(options);
  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
}

export function useExercise<
  Parameters extends Record<string, unknown>,
  Action,
  State extends StoredExerciseState,
>(): ExerciseContextValue<Parameters, Action, State> {
  const value = useContext(ExerciseContext);
  if (!value) {
    throw new Error('useExercise must be used within an Exercise component.');
  }
  return value as ExerciseContextValue<Parameters, Action, State>;
}
