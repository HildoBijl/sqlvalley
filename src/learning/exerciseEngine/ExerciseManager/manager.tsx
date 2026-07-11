import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { Alert, Typography } from '@mui/material';

import { useLearningStore, type SkillModuleState } from '@/store';
import { Exercise, type AnyExerciseDefinition } from '../Exercise';
import { exerciseHelpers } from './helpers';

interface ExerciseManagerProps {
  skillId: string;
  exercises: ReadonlyArray<AnyExerciseDefinition>;
  unavailableMessage?: ReactNode;
  pendingMessage?: ReactNode;
}

/**
 * Owns exercise selection and lifecycle for a skill. Fed the skill's definitions
 * by the page, it matches the store's current exercise to one of them (starting a
 * new one when missing or stale) and renders that definition's component.
 */
export function ExerciseManager({
  skillId,
  exercises,
  unavailableMessage,
  pendingMessage,
}: ExerciseManagerProps) {
  const skillModule = useLearningStore(
    (store) => store.modules[skillId] as SkillModuleState | undefined,
  );
  const current = skillModule?.exercises?.[skillModule.exercises.length - 1] ?? null;

  const byId = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.exerciseId, exercise])),
    [exercises],
  );
  const matched = current ? byId.get(current.exerciseId) ?? null : null;
  const active = matched && matched.version === current?.version ? matched : null;

  const startNewExercise = useCallback(() => {
    const store = useLearningStore.getState();
    const instance = store.getCurrentExerciseInstance(skillId);
    const currentDefinition = instance ? byId.get(instance.exerciseId) : null;
    const candidates = currentDefinition && exercises.length > 1
      ? exercises.filter((exercise) => exercise.exerciseId !== currentDefinition.exerciseId)
      : exercises;
    if (candidates.length === 0) return;
    const next = exerciseHelpers.selectRandomly(candidates);
    const parameters = next.generateParameters(exerciseHelpers, {
      previousParameters: instance?.parameters ?? null,
    });
    store.startNewExercise(skillId, next.exerciseId, next.version, parameters);
  }, [byId, exercises, skillId]);

  // Ensure exactly one valid exercise is active. Reads the live store so React
  // StrictMode's double-invoke can't start two.
  useEffect(() => {
    if (exercises.length === 0) return;
    const store = useLearningStore.getState();
    const instance = store.getCurrentExerciseInstance(skillId);
    const definition = instance ? byId.get(instance.exerciseId) : undefined;
    if (instance && definition && definition.version === instance.version) return;
    const next = definition ?? exerciseHelpers.selectRandomly(exercises);
    const parameters = next.generateParameters(exerciseHelpers, {
      previousParameters: instance?.parameters ?? null,
    });
    store.startNewExercise(skillId, next.exerciseId, next.version, parameters);
  }, [byId, exercises, skillId]);

  if (exercises.length === 0) {
    return <Alert severity="info">{unavailableMessage ?? 'No exercises are available yet.'}</Alert>;
  }
  if (!active) {
    return (
      <Typography color="text.secondary">
        {pendingMessage ?? 'Generating your next exercise...'}
      </Typography>
    );
  }

  const { Component } = active;
  return (
    <Exercise
      skillId={skillId}
      initialState={active.initialState}
      isComplete={active.isComplete}
      isSolved={active.isSolved}
      startNewExercise={startNewExercise}
    >
      <Component />
    </Exercise>
  );
}
