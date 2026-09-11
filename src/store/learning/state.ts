import type { StoredExerciseInstance } from '@sqlvalley/exercise-engine/storedState'

interface BaseModuleState {
	id: string
	tab?: string
	lastAccessed?: number
	understood?: true
}
export type ConceptModuleState = BaseModuleState
export interface SkillModuleState extends BaseModuleState {
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

export function createModuleState(id: string, type: ModuleType): ModuleState {
	switch (type) {
		case 'concept':
			return { id }
		case 'skill':
		default:
			return { id, solvedExerciseCount: 0, exerciseHistory: [] }
	}
}
