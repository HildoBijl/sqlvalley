import { useEffect, useState } from 'react';

import { type Module, skillTree } from '../skillTree';
import { skillExerciseLoaders } from '../utils/loaders';

import type { AnyExerciseDefinition } from '@/learning/exerciseEngine';

type SkillExerciseLoader = (typeof skillExerciseLoaders)[keyof typeof skillExerciseLoaders];
type SkillExerciseModule = Record<string, unknown>;
type BuildExercises = (skillId: string) => AnyExerciseDefinition[];

interface SkillContentState {
  isLoading: boolean;
  skillMeta: (Module & { database?: string }) | null;
  exerciseDefinitions: AnyExerciseDefinition[] | null;
  error: string | null;
}

interface UseSkillContentOptions {
  loadExercises?: boolean;
}

const initialState: SkillContentState = {
  isLoading: true,
  skillMeta: null,
  exerciseDefinitions: null,
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
      setState({ isLoading: false, skillMeta: null, exerciseDefinitions: null, error: null });
      return;
    }

    let cancelled = false;

    const updateState = (partial: Partial<SkillContentState>) => {
      if (cancelled) return;
      setState((prev) => ({ ...prev, ...partial }));
    };

    updateState({ isLoading: true, exerciseDefinitions: null, error: null });

    const entry =
      Object.values(skillTree).find((item) => item.type === 'skill' && item.id === skillId) ||
      null;
    updateState({ skillMeta: entry });

    if (!entry) {
      updateState({ exerciseDefinitions: null, isLoading: false, error: 'Skill metadata could not be found.' });
      return () => { cancelled = true; };
    }

    if (!loadExercises) {
      updateState({ exerciseDefinitions: null, isLoading: false, error: null });
      return () => { cancelled = true; };
    }

    const loader = skillId in skillExerciseLoaders
      ? (skillExerciseLoaders[skillId as keyof typeof skillExerciseLoaders] as SkillExerciseLoader)
      : undefined;

    if (!loader) {
      updateState({ exerciseDefinitions: null, isLoading: false, error: 'Practice for this skill is coming soon.' });
      return () => { cancelled = true; };
    }

    loader()
      .then((loadedModule) => {
        if (cancelled) return;
        const mod = loadedModule as SkillExerciseModule;
        const build = typeof mod.default === 'function' ? (mod.default as BuildExercises) : null;
        if (!build) {
          throw new Error(`Exercise module for "${skillId}" has no default builder export.`);
        }
        updateState({ exerciseDefinitions: build(skillId), error: null });
      })
      .catch((error) => {
        console.error('Failed to load skill content:', error);
        updateState({ exerciseDefinitions: null, error: 'Failed to load skill exercises. Please try again later.' });
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
