import { useCallback, useMemo } from 'react';

import {
  createModuleState,
  useLearningStore,
  type SkillModuleState,
  type StoredExerciseInstance,
  type StoredExerciseState,
} from '@/store';
import type {
  ExerciseContextValue,
  ExerciseDescriptor,
  ExerciseSessionOptions,
} from './types';

function getCurrentInstance(moduleState: SkillModuleState): StoredExerciseInstance | null {
  return moduleState.exercises[moduleState.exercises.length - 1] ?? null;
}

function descriptorMatches(
  instance: StoredExerciseInstance | null,
  descriptor: ExerciseDescriptor<Record<string, unknown>>,
): boolean {
  return instance?.exerciseId === descriptor.exerciseId && instance.version === descriptor.version;
}

const recentlyEnsuredExercises = new Map<
  string,
  ExerciseDescriptor<Record<string, unknown>>
>();

function readStoredState<State extends StoredExerciseState>(
  instance: StoredExerciseInstance | null,
  initialState: State,
): State {
  const latestState = instance?.events[instance.events.length - 1]?.resultingState;
  return (latestState ? { ...latestState } : { ...initialState }) as State;
}

export function useExerciseSession<
  Parameters extends Record<string, unknown>,
  Action,
  State extends StoredExerciseState,
>({
  skillId,
  reducer,
  initialState,
  isComplete,
  isSolved,
  serializeAction,
}: ExerciseSessionOptions<Parameters, Action, State>): ExerciseContextValue<Parameters, Action, State> {
  const moduleState = useLearningStore((store) => {
    const existing = store.modules[skillId];
    return (existing ?? createModuleState(skillId, 'skill')) as SkillModuleState;
  });
  const instance = useMemo(() => getCurrentInstance(moduleState), [moduleState]);
  const state = useMemo(() => readStoredState(instance, initialState), [initialState, instance]);

  const startExercise = useCallback(
    (descriptor: ExerciseDescriptor<Parameters>) => {
      useLearningStore.getState().startNewExercise(
        skillId,
        descriptor.exerciseId,
        descriptor.version,
        descriptor.parameters,
      );
    },
    [skillId],
  );

  const ensureExercise = useCallback(
    (descriptor: ExerciseDescriptor<Parameters>) => {
      const store = useLearningStore.getState();
      const current = store.getCurrentExerciseInstance(skillId);
      if (descriptorMatches(current, descriptor)) {
        return;
      }
      const recentlyEnsured = recentlyEnsuredExercises.get(skillId);
      if (recentlyEnsured && descriptorMatches(current, recentlyEnsured)) {
        return;
      }
      recentlyEnsuredExercises.set(skillId, descriptor);
      store.startNewExercise(
        skillId,
        descriptor.exerciseId,
        descriptor.version,
        descriptor.parameters,
      );
      queueMicrotask(() => {
        if (recentlyEnsuredExercises.get(skillId) === descriptor) {
          recentlyEnsuredExercises.delete(skillId);
        }
      });
    },
    [skillId],
  );

  const submitAction = useCallback(
    (action: Action): State => {
      const store = useLearningStore.getState();
      const current = store.getCurrentExerciseInstance(skillId);
      if (!current) {
        throw new Error(`Cannot submit an action for "${skillId}" without an active exercise.`);
      }

      const previousState = readStoredState(current, initialState);
      const nextState = reducer({
        parameters: current.parameters as Parameters,
        action,
        previousState,
      });
      store.submitExerciseAction(
        skillId,
        serializeAction(action),
        nextState,
        isComplete(nextState),
        isSolved(nextState) && !isSolved(previousState),
      );
      return nextState;
    },
    [initialState, isComplete, isSolved, reducer, serializeAction, skillId],
  );

  const setDraftInput = useCallback(
    (draftInput: unknown) => {
      const store = useLearningStore.getState();
      if (!store.getCurrentExerciseInstance(skillId)) {
        return;
      }
      store.setExerciseDraftInput(skillId, draftInput);
    },
    [skillId],
  );

  const descriptor = instance
    ? {
        exerciseId: instance.exerciseId,
        version: instance.version,
        parameters: instance.parameters as Parameters,
      }
    : null;

  return {
    descriptor,
    instance,
    state,
    events: instance?.events ?? [],
    parameters: descriptor?.parameters ?? null,
    draftInput: instance?.draftInput,
    startExercise,
    ensureExercise,
    submitAction,
    setDraftInput,
  };
}
