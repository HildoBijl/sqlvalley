import type { LearningState, ModuleState } from './types'
import { normalizeModuleState } from './support'

export interface PersistedLearning {
	modules?: Record<string, Partial<ModuleState> | ModuleState>
}

export function partializeLearning(state: LearningState): PersistedLearning {
	return {
		modules: state.modules,
	}
}

export function normalizePersistedLearning(persisted: PersistedLearning | undefined): Partial<LearningState> {
	const rawModules = persisted?.modules
	if (!rawModules) return {}
	return { modules: Object.fromEntries(Object.entries(rawModules).map(([id, value]) => [id, normalizeModuleState(id, value as Partial<ModuleState> | undefined),])) }
}
