import { useCallback } from 'react'

import { EXERCISES_REQUIRED_FOR_SKILL_COMPLETION, useModuleCompletion } from '@sqlvalley/progress'

import { useLearningStore } from '@/store'
import { type ModuleId, moduleTree } from '@/curriculum'
import { getStorySolvedCount, isStoryModuleId } from '@/curriculum/exercises'

export function useModuleProgress(moduleId: ModuleId) {
	// Load in data from the data store and process it.
	const modules = useLearningStore(state => state.modules)
	const { isCompleted: isModuleCompleted } = useModuleCompletion(moduleTree, modules)
	const state = modules[moduleId]
	const solvedExerciseCount = state?.moduleType === 'skill' ? state.solvedExerciseCount : 0
	const storySolvedCount = isStoryModuleId(moduleId) ? getStorySolvedCount(moduleId, state?.moduleType === 'skill' ? state.exerciseHistory : []) : undefined

	// Set up a handler to complete a module.
	const completeConcept = useLearningStore(state => state.completeConcept)
	const completeSkill = useLearningStore(state => state.completeSkill)
	const completeModule = useCallback(() => {
		if (moduleTree[moduleId].type === 'skill') completeSkill(moduleId)
		else completeConcept(moduleId)
	}, [moduleId, completeSkill, completeConcept])

	// Return the progress data in an object.
	return {
		completed: isModuleCompleted(moduleId),
		storyCompleted: storySolvedCount === undefined ? undefined : storySolvedCount === 3,
		storyProgress: storySolvedCount === undefined ? undefined : { current: storySolvedCount, required: 3 },
		isModuleCompleted,
		exerciseProgress: { current: solvedExerciseCount, required: EXERCISES_REQUIRED_FOR_SKILL_COMPLETION },
		completeModule,
	}
}
