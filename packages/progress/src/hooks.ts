import { useCallback, useMemo } from 'react'

import type { ModuleTree } from '@step-wise/module-tree-definition'

import type { ModuleProgressState } from './types'
import { getRawModuleCompletion, processModuleCompletion } from './logic'

function useRawModuleCompletion(
	moduleTree: ModuleTree,
	moduleStates: Record<string, ModuleProgressState>,
) {
	return useMemo(() => getRawModuleCompletion(moduleTree, moduleStates), [moduleTree, moduleStates])
}

export function useModuleCompletion(
	moduleTree: ModuleTree,
	moduleStates: Record<string, ModuleProgressState>,
) {
	const rawCompletion = useRawModuleCompletion(moduleTree, moduleStates)

	return useMemo(() => processModuleCompletion(moduleTree, rawCompletion), [moduleTree, rawCompletion])
}

export function useModuleProgress(
	moduleTree: ModuleTree,
	moduleStates: Record<string, ModuleProgressState>,
) {
	const modules = useMemo(() => Object.values(moduleTree), [moduleTree])
	const concepts = useMemo(() => modules.filter(module => module.type === 'concept'), [modules])
	const skills = useMemo(() => modules.filter(module => module.type === 'skill'), [modules])
	const processed = useModuleCompletion(moduleTree, moduleStates)

	const isCompleted = useCallback((id: string) => processed.completed.has(id), [processed])

	const getProgress = useCallback(
		(id: string) => {
			const progress = processed.skillProgress[id]
			if (progress === undefined) return null
			return `${progress}/${processed.requiredCount}`
		},
		[processed],
	)

	const completedConcepts = useMemo(
		() => concepts.filter(concept => processed.completed.has(concept.id)).length,
		[concepts, processed],
	)

	const completedSkills = useMemo(
		() => skills.filter(skill => processed.completed.has(skill.id)).length,
		[processed, skills],
	)

	return {
		concepts,
		skills,
		isCompleted,
		getProgress,
		completedConcepts,
		completedSkills,
	}
}
