import type { ModuleType } from '@sqlvalley/skill-tree-definition'

import { type ConceptState, type ModuleState, type SkillState, createModuleState } from './state'
import { useLearningStore } from './store'

export function useModuleState(moduleId: string, moduleType: 'concept'): ConceptState
export function useModuleState(moduleId: string, moduleType: 'skill'): SkillState
export function useModuleState(moduleId: string, moduleType: ModuleType): ModuleState
export function useModuleState(moduleId: string, moduleType: ModuleType): ModuleState {
	return useLearningStore(state => {
		const module = state.modules[moduleId]
		return module?.moduleType === moduleType ? module : createModuleState(moduleId, moduleType)
	})
}
