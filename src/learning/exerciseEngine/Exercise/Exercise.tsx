import type { StoredExerciseAction, StoredExerciseState } from '@/store';
import { ExerciseContext, type AnyExerciseContextValue } from './context';
import type { ExerciseProps } from './types';
import { useExerciseSession } from './useExerciseSession';

/** Runs an exercise session and exposes it to descendants through ExerciseContext. */
export function Exercise<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
>(props: ExerciseProps<Parameters, Action, State>) {
  const { children, ...options } = props;
  const value = useExerciseSession(options);
  return (
    <ExerciseContext.Provider value={value as unknown as AnyExerciseContextValue}>
      {children}
    </ExerciseContext.Provider>
  );
}
