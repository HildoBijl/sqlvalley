import { ExerciseContext } from './context';
import type { ExerciseProps } from './types';

/** Wraps a ready-made exercise context and renders the active exercise's component. */
export function Exercise({ value }: ExerciseProps) {
  const { Component } = value.definition;
  return (
    <ExerciseContext.Provider value={value}>
      <Component />
    </ExerciseContext.Provider>
  );
}
