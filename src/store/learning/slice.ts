/**
 * Learning store slice.
 */

import type {
  AsyncExerciseReducer,
  ExerciseActionResult,
  ModuleState,
  ModuleType,
  ConceptModuleState,
  LearningState,
  SkillModuleState,
  StoredExerciseAction,
  StoredExerciseInstance,
  StoredExerciseState,
} from './types';
import {
  createModuleState,
  normalizeConceptModuleState,
  normalizeSkillModuleState,
} from './support';
import type { SetState, GetState } from '../utils';

export const initialLearningState: LearningState = {
  modules: {} as Record<string, ModuleState>,
};

export interface LearningActions {
  setModuleTab: (id: string, type: ModuleType, tab: string) => void;
  completeConcept: (conceptId: string) => void;
  completeSkill: (skillId: string) => void;
  startNewExercise: (
    skillId: string,
    exerciseId: string,
    version: number,
    parameters: Record<string, unknown>,
  ) => void;
  submitExerciseAction: (
    skillId: string,
    action: StoredExerciseAction,
    resultingState: StoredExerciseState,
    exerciseDone: boolean,
    increaseSolvedCounter: boolean,
  ) => void;
  setExerciseDraftInput: (skillId: string, draftInput: unknown) => void;
  processExerciseAction: (
    skillId: string,
    action: StoredExerciseAction,
    run: AsyncExerciseReducer,
    options: {
      isComplete: (state: StoredExerciseState) => boolean;
      isSolved: (state: StoredExerciseState) => boolean;
    },
  ) => Promise<ExerciseActionResult>;
  getModule: (id: string, type: ModuleType) => ModuleState;
  resetModule: (id: string, type: ModuleType) => void;
  getCurrentExerciseInstance: (skillId: string) => StoredExerciseInstance | null;
  getAllExerciseInstances: (skillId: string) => StoredExerciseInstance[];
}

function getConceptModuleForUpdate(moduleId: string, state: LearningState): ConceptModuleState {
  return normalizeConceptModuleState(moduleId, state.modules[moduleId]);
}

function getSkillModuleForUpdate(moduleId: string, state: LearningState): SkillModuleState {
  return normalizeSkillModuleState(moduleId, state.modules[moduleId]);
}

function readLatestState(instance: StoredExerciseInstance): StoredExerciseState {
  return { ...(instance.events[instance.events.length - 1]?.resultingState ?? {}) };
}

export function createLearningActions(
  set: SetState<LearningState>,
  get: GetState<LearningState>,
): LearningActions {
  return {
    setModuleTab: (id, type, tab) =>
      set((state) => {
        const now = Date.now();
        const nextState =
          type === 'skill'
            ? {
              ...getSkillModuleForUpdate(id, state),
              tab,
              lastAccessed: now,
            }
            : {
              ...getConceptModuleForUpdate(id, state),
              tab,
              lastAccessed: now,
            };

        return {
          modules: {
            ...state.modules,
            [id]: nextState,
          },
        };
      }),

    completeConcept: (conceptId) =>
      set((state) => {
        const currentConcept = getConceptModuleForUpdate(conceptId, state);

        return {
          modules: {
            ...state.modules,
            [conceptId]: {
              ...currentConcept,
              understood: true,
              lastAccessed: Date.now(),
            },
          },
        };
      }),

    completeSkill: (skillId) =>
      set((state) => {
        const currentSkill = getSkillModuleForUpdate(skillId, state);

        return {
          modules: {
            ...state.modules,
            [skillId]: {
              ...currentSkill,
              understood: true,
              lastAccessed: Date.now(),
            },
          },
        };
      }),

    startNewExercise: (skillId, exerciseId, version, parameters) =>
      set((state) => {
        const skillModule = getSkillModuleForUpdate(skillId, state);
        const newExercise: StoredExerciseInstance = {
          exerciseId,
          version,
          parameters: { ...parameters },
          createdAt: Date.now(),
          events: [],
          draftInput: undefined,
        };

        return {
          modules: {
            ...state.modules,
            [skillId]: {
              ...skillModule,
              lastAccessed: Date.now(),
              exercises: [...skillModule.exercises, newExercise],
            },
          },
        };
      }),

    submitExerciseAction: (skillId, action, resultingState, exerciseDone, increaseSolvedCounter) =>
      set((state) => {
        const skillModule = getSkillModuleForUpdate(skillId, state);
        if (skillModule.exercises.length === 0) {
          throw new Error(`Cannot submit exercise action for "${skillId}" without an active exercise.`);
        }

        const lastIndex = skillModule.exercises.length - 1;
        const currentExercise = skillModule.exercises[lastIndex];
        const updatedExercise: StoredExerciseInstance = {
          ...currentExercise,
          events: [
            ...currentExercise.events,
            {
              timestamp: Date.now(),
              action: { ...action },
              resultingState: { ...resultingState },
            },
          ],
          draftInput: exerciseDone ? undefined : currentExercise.draftInput,
        };

        const exercises = [
          ...skillModule.exercises.slice(0, -1),
          updatedExercise,
        ];

        return {
          modules: {
            ...state.modules,
            [skillId]: {
              ...skillModule,
              lastAccessed: Date.now(),
              numSolved: increaseSolvedCounter ? skillModule.numSolved + 1 : skillModule.numSolved,
              exercises,
            },
          },
        };
      }),

    setExerciseDraftInput: (skillId, draftInput) =>
      set((state) => {
        const skillModule = getSkillModuleForUpdate(skillId, state);
        if (skillModule.exercises.length === 0) {
          throw new Error(`Cannot set draft input for "${skillId}" without an active exercise.`);
        }

        const updatedExercise: StoredExerciseInstance = {
          ...skillModule.exercises[skillModule.exercises.length - 1],
          draftInput,
        };
        const exercises = [
          ...skillModule.exercises.slice(0, -1),
          updatedExercise,
        ];

        return {
          modules: {
            ...state.modules,
            [skillId]: {
              ...skillModule,
              lastAccessed: Date.now(),
              exercises,
            },
          },
        };
      }),

    processExerciseAction: async (skillId, action, run, { isComplete, isSolved }) => {
      const skillModule = normalizeSkillModuleState(skillId, get().modules[skillId]);
      const current = skillModule.exercises[skillModule.exercises.length - 1] ?? null;
      if (!current) {
        throw new Error(`Cannot process an action for "${skillId}" without an active exercise.`);
      }
      if (skillModule.pending) {
        return { state: readLatestState(current) };
      }

      const previousState = readLatestState(current);
      set((state) => ({
        modules: {
          ...state.modules,
          [skillId]: { ...getSkillModuleForUpdate(skillId, state), pending: true },
        },
      }));

      let result: ExerciseActionResult;
      try {
        result = await run({ parameters: { ...current.parameters }, action, previousState });
      } catch (error) {
        set((state) => ({
          modules: {
            ...state.modules,
            [skillId]: { ...getSkillModuleForUpdate(skillId, state), pending: false },
          },
        }));
        throw error;
      }

      const nextState = result.state;
      set((state) => {
        const module = getSkillModuleForUpdate(skillId, state);
        if (module.exercises.length === 0) return {};
        const currentExercise = module.exercises[module.exercises.length - 1];
        const updatedExercise: StoredExerciseInstance = {
          ...currentExercise,
          events: [
            ...currentExercise.events,
            { timestamp: Date.now(), action: { ...action }, resultingState: { ...nextState } },
          ],
          draftInput: isComplete(nextState) ? undefined : currentExercise.draftInput,
        };
        return {
          modules: {
            ...state.modules,
            [skillId]: {
              ...module,
              pending: false,
              lastAccessed: Date.now(),
              numSolved: isSolved(nextState) && !isSolved(previousState)
                ? module.numSolved + 1
                : module.numSolved,
              exercises: [...module.exercises.slice(0, -1), updatedExercise],
            },
          },
        };
      });

      return result;
    },

    getModule: (id, type) =>
      type === 'skill'
        ? normalizeSkillModuleState(id, get().modules[id])
        : normalizeConceptModuleState(id, get().modules[id]),

    resetModule: (id, type) =>
      set((state) => {
        return {
          modules: {
            ...state.modules,
            [id]: createModuleState(id, type),
          },
        };
      }),

    getCurrentExerciseInstance: (skillId) => {
      const skillModule = normalizeSkillModuleState(skillId, get().modules[skillId]);
      return skillModule.exercises[skillModule.exercises.length - 1] ?? null;
    },

    getAllExerciseInstances: (skillId) => {
      const skillModule = normalizeSkillModuleState(skillId, get().modules[skillId]);
      return [...skillModule.exercises];
    },
  };
}
