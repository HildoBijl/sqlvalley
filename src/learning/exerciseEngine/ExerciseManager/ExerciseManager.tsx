import { useCallback, useEffect, useMemo } from 'react';
import { Alert, Typography } from '@mui/material';

import {
  useLearningStore,
  type StoredExerciseAction,
  type StoredExerciseState,
} from '@/store';
import { useExercise } from '../Exercise';
import { exerciseHelpers } from './helpers';
import type { ExerciseManagerProps, ManagedExercise } from './types';

/**
 * Owns exercise selection and lifecycle for a skill: ensures one is active
 * (generating when needed) and renders it. Content-agnostic.
 */
export function ExerciseManager<
  Parameters extends Record<string, unknown>,
  T extends ManagedExercise<Parameters>,
>({ exercises, unavailableMessage, pendingMessage, children }: ExerciseManagerProps<Parameters, T>) {
  const { skillId, descriptor, parameters, startExercise } = useExercise<
    Parameters,
    StoredExerciseAction,
    StoredExerciseState
  >();

  const byId = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.exerciseId, exercise])),
    [exercises],
  );
  const active = descriptor ? byId.get(descriptor.exerciseId) ?? null : null;

  // Build a fresh descriptor (id, version, randomized parameters) for an exercise.
  const createDescriptor = useCallback(
    (exercise: T) => ({
      exerciseId: exercise.exerciseId,
      version: exercise.version,
      parameters: exercise.generateParameters(exerciseHelpers, { previousParameters: parameters }),
    }),
    [parameters],
  );

  const startSpecific = useCallback(
    (exerciseId: string) => {
      const exercise = byId.get(exerciseId);
      if (exercise) startExercise(createDescriptor(exercise));
    },
    [byId, createDescriptor, startExercise],
  );

  const startNewExercise = useCallback(() => {
    const candidates = active && exercises.length > 1
      ? exercises.filter((exercise) => exercise.exerciseId !== active.exerciseId)
      : exercises;
    if (candidates.length === 0) return;
    startExercise(createDescriptor(exerciseHelpers.selectRandomly(candidates)));
  }, [active, createDescriptor, exercises, startExercise]);

  // Ensure exactly one valid exercise is active. Reads the live store rather than
  // the captured descriptor so React StrictMode's double-invoke can't start two.
  useEffect(() => {
    if (exercises.length === 0) return;
    const current = useLearningStore.getState().getCurrentExerciseInstance(skillId);
    if (!current) {
      startExercise(createDescriptor(exerciseHelpers.selectRandomly(exercises)));
      return;
    }
    const stored = byId.get(current.exerciseId);
    if (!stored || stored.version !== current.version) {
      startExercise(createDescriptor(stored ?? exerciseHelpers.selectRandomly(exercises)));
    }
  }, [byId, createDescriptor, exercises, skillId, startExercise]);

  if (exercises.length === 0) {
    return <Alert severity="info">{unavailableMessage ?? 'No exercises are available yet.'}</Alert>;
  }
  if (!active || !parameters) {
    return (
      <Typography color="text.secondary">
        {pendingMessage ?? 'Generating your next exercise...'}
      </Typography>
    );
  }

  return <>{children(active, { startNewExercise, startExercise: startSpecific })}</>;
}
