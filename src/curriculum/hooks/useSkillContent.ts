import { useEffect, useState } from 'react';

import { type Module, skillTree } from '../skillTree';
import { skillExerciseLoaders } from '../utils/loaders';

import type { SimpleSQLExerciseComponent } from '@/learning/sqlExercises';

type SkillExerciseLoader = (typeof skillExerciseLoaders)[keyof typeof skillExerciseLoaders];
type SkillExerciseModule = Record<string, unknown>;

interface SkillContentState {
  isLoading: boolean;
  skillMeta: (Module & { database?: string }) | null;
  exerciseComponent: SimpleSQLExerciseComponent | null;
  error: string | null;
}

interface UseSkillContentOptions {
  loadExercises?: boolean;
}

const initialState: SkillContentState = {
  isLoading: true,
  skillMeta: null,
  exerciseComponent: null,
  error: null,
};

export function useSkillContent(
  skillId?: string,
  options?: UseSkillContentOptions,
): SkillContentState {
  const loadExercises = options?.loadExercises ?? true;
  const [state, setState] = useState<SkillContentState>(initialState);

  useEffect(() => {
    if (!skillId) {
      setState({
        isLoading: false,
        skillMeta: null,
        exerciseComponent: null,
        error: null,
      });
      return;
    }

    let cancelled = false;

    const updateState = (partial: Partial<SkillContentState>) => {
      if (cancelled) return;
      setState((prev) => ({ ...prev, ...partial }));
    };

    updateState({
      isLoading: true,
      exerciseComponent: null,
      error: null,
    });

    const entry =
      Object.values(skillTree).find((item) => item.type === 'skill' && item.id === skillId) ||
      null;
    updateState({ skillMeta: entry });

    if (!entry) {
      updateState({
        exerciseComponent: null,
        isLoading: false,
        error: 'Skill metadata could not be found.',
      });
      return () => {
        cancelled = true;
      };
    }

    if (!loadExercises) {
      updateState({
        exerciseComponent: null,
        isLoading: false,
        error: null,
      });
      return () => {
        cancelled = true;
      };
    }

    const loader = skillId in skillExerciseLoaders
      ? (skillExerciseLoaders[
          skillId as keyof typeof skillExerciseLoaders
        ] as SkillExerciseLoader)
      : undefined;

    if (!loader) {
      updateState({
        exerciseComponent: null,
        isLoading: false,
        error: 'Practice for this skill is coming soon.',
      });
      return () => {
        cancelled = true;
      };
    }

    loader()
      .then((loadedModule) => {
        if (cancelled) return;
        const mod = loadedModule as SkillExerciseModule;
        const exerciseComponent = typeof mod.default === 'function'
          ? mod.default as SimpleSQLExerciseComponent
          : null;
        if (!exerciseComponent) {
          throw new Error(`Exercise module for "${skillId}" has no default component export.`);
        }
        updateState({
          exerciseComponent,
          error: null,
        });
      })
      .catch((error) => {
        console.error('Failed to load skill content:', error);
        updateState({
          exerciseComponent: null,
          error: 'Failed to load skill exercises. Please try again later.',
        });
      })
      .finally(() => {
        updateState({ isLoading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [skillId, loadExercises]);

  return state;
}
