import type { StoredExerciseInstance } from '@sqlvalley/exercise-engine/storedState'

interface BaseModuleState {
	id: string
	tab?: string
	lastAccessed?: number
	understood?: true
}
export interface ConceptModuleState extends BaseModuleState {
	moduleType: 'concept'
}
export interface SkillModuleState extends BaseModuleState {
	moduleType: 'skill'
	solvedExerciseCount: number
	exerciseHistory: StoredExerciseInstance[]
}
export type ModuleState = ConceptModuleState | SkillModuleState

export type ModuleType = 'concept' | 'skill'
export interface LearningState {
	modules: Record<string, ModuleState>
}

export const initialLearningState: LearningState = {
	modules: {} as Record<string, ModuleState>,
}

export function createModuleState(id: string, moduleType: ModuleType): ModuleState {
	switch (moduleType) {
		case 'concept':
			return { id, moduleType }
		case 'skill':
		default:
			return { id, moduleType, solvedExerciseCount: 0, exerciseHistory: [] }
	}
}
