import type { ModuleType, SkillId } from '@step-wise/module-tree-definition'
import type { ExerciseInstance } from '@sqlvalley/exercise-instances'

import { type ConceptState, type ModuleState, type SkillState, createModuleState } from './state'
import { useLearningStore } from './store'

export function useCurrentExerciseInstance(skillId: SkillId): ExerciseInstance | undefined {
	return useLearningStore(state => {
		const module = state.modules[skillId]
		if (module?.moduleType !== 'skill') return undefined
		return module.exerciseHistory[module.exerciseHistory.length - 1]
	})
}

export function useModuleState(moduleId: string, moduleType: 'concept'): ConceptState
export function useModuleState(moduleId: string, moduleType: 'skill'): SkillState
export function useModuleState(moduleId: string, moduleType: ModuleType): ModuleState
export function useModuleState(moduleId: string, moduleType: ModuleType): ModuleState {
	return useLearningStore(state => {
		const module = state.modules[moduleId]
		return module?.moduleType === moduleType ? module : createModuleState(moduleId, moduleType)
	})
}
