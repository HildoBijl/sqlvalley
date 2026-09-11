import { asRecord } from '../utils'
import { isRecord } from '../validation'
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

export function normalizePersistedLearning(persisted: unknown): Partial<LearningState> {
	const rawModules = asRecord(persisted).modules
	if (!isRecord(rawModules)) return {}
	const modules: Record<string, ModuleState> = {}
	for (const [id, value] of Object.entries(rawModules)) {
		if (!id.trim()) continue
		const module = normalizeModuleState(id, value)
		if (module) modules[id] = module
	}
	return { modules }
}
