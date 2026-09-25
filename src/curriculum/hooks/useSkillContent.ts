import { useEffect, useState } from 'react';

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { type Module, moduleTree } from '../moduleDefinition'
import { subscribeToExerciseUpdates } from '../utils/exerciseHotReload'
import { skillExerciseLoaders } from '../utils/exerciseLoaders'

type SkillExerciseLoader = (typeof skillExerciseLoaders)[keyof typeof skillExerciseLoaders];
type SkillExerciseModule = Record<string, unknown>;
type BuildExercises = (skillId: string) => ExerciseRegistration[];

interface SkillContentState {
	isLoading: boolean;
	skillMeta: (Module & { database?: string }) | null;
	exerciseDefinitions: ExerciseRegistration[] | null;
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
			Object.values(moduleTree).find((item) => item.type === 'skill' && item.id === skillId) ||
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

		let requestId = 0
		const reloadExercises = async () => {
			const request = ++requestId
			try {
				const loadedModule = await loader()
				if (cancelled || request !== requestId) return
				const mod = loadedModule as SkillExerciseModule
				const build = typeof mod.default === 'function' ? (mod.default as BuildExercises) : null
				if (!build) throw new Error(`Exercise module for "${skillId}" has no default builder export.`)
				updateState({ exerciseDefinitions: build(skillId), error: null, isLoading: false })
			} catch (error) {
				if (cancelled || request !== requestId) return
				console.error('Failed to load skill content:', error)
				updateState({ error: 'Failed to load skill exercises. Please try again later.', isLoading: false })
			}
		}

		// Keep the mounted manager and stored instance while replacing its registrations.
		const unsubscribe = import.meta.hot ? subscribeToExerciseUpdates(skillId, () => { void reloadExercises() }) : undefined
		void reloadExercises()

		return () => {
			cancelled = true;
			unsubscribe?.()
		};
	}, [skillId, loadExercises]);

	return state;
}
