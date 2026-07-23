import type { ExerciseHelpers } from '../Exercise';

/** Randomization helpers handed to each exercise's generateParameters. */
export const exerciseHelpers: ExerciseHelpers = {
  selectRandomly: <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)],
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};
