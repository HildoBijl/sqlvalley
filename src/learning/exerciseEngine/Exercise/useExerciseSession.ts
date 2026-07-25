import { useCallback, useMemo } from 'react';

import {
  createModuleState,
  useLearningStore,
  type SkillModuleState,
  type StoredExerciseAction,
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

function readStoredState<State extends StoredExerciseState>(
  instance: StoredExerciseInstance | null,
  initialState: State,
): State {
  const latestState = instance?.events[instance.events.length - 1]?.resultingState;
  return (latestState ? { ...latestState } : { ...initialState }) as State;
}

export function useExerciseSession<
  Parameters extends Record<string, unknown>,
  Action extends StoredExerciseAction,
  State extends StoredExerciseState,
>({
  skillId,
  reducer,
  initialState,
  isComplete,
  isSolved,
  startNewExercise,
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

  const submitAction = useCallback(
    (action: Action): State => {
      const store = useLearningStore.getState();
      const current = store.getCurrentExerciseInstance(skillId);
      if (!current) {
        throw new Error(`Cannot submit an action for "${skillId}" without an active exercise.`);
      }

      if (!reducer) {
        throw new Error(`Cannot submit a sync action for "${skillId}" without a reducer.`);
      }
      const previousState = readStoredState(current, initialState);
      const nextState = reducer({
        parameters: current.parameters as Parameters,
        action,
        previousState,
      });
      store.submitExerciseAction(
        skillId,
        action,
        nextState,
        undefined,
        isComplete(nextState),
        isSolved(nextState) && !isSolved(previousState),
      );
      return nextState;
    },
    [initialState, isComplete, isSolved, reducer, skillId],
  );

  const processAction = useCallback<ExerciseContextValue<Parameters, Action, State>['processAction']>(
    (action, run, options) =>
      useLearningStore.getState().processExerciseAction(skillId, action, run, options),
    [skillId],
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
    skillId,
    descriptor,
    instance,
    state,
    events: instance?.events ?? [],
    parameters: descriptor?.parameters ?? null,
    draftInput: instance?.draftInput,
    pending: moduleState.pending ?? false,
    startExercise,
    startNewExercise: startNewExercise ?? (() => {}),
    submitAction,
    processAction,
    setDraftInput,
  };
}
