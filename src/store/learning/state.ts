import type { ModuleType } from '@step-wise/module-tree-definition'
import type { ExerciseInstance } from '@sqlvalley/exercise-engine/exerciseSelection'

interface BaseModuleState {
	id: string
	tab?: string
	lastAccessed?: number
	understood?: true
}
export interface ConceptState extends BaseModuleState {
	moduleType: 'concept'
}
export interface SkillState extends BaseModuleState {
	moduleType: 'skill'
	solvedExerciseCount: number
	exerciseHistory: ExerciseInstance[]
}
export type ModuleState = ConceptState | SkillState

export interface LearningState {
	modules: Record<string, ModuleState>
}

export const initialLearningState: LearningState = {
	modules: {} as Record<string, ModuleState>,
}

export function createModuleState(id: string, moduleType: 'concept'): ConceptState
export function createModuleState(id: string, moduleType: 'skill'): SkillState
export function createModuleState(id: string, moduleType: ModuleType): ModuleState
export function createModuleState(id: string, moduleType: ModuleType): ModuleState {
	switch (moduleType) {
		case 'concept':
			return { id, moduleType }
		case 'skill':
		default:
			return { id, moduleType, solvedExerciseCount: 0, exerciseHistory: [] }
	}
}
