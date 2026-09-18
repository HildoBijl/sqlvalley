import { type ExerciseInstance, normalizeExerciseInstance } from '@sqlvalley/exercise-instances'

import { asRecord, isRecord } from '../infrastructure'
import { type ConceptState, type LearningState, type ModuleState, type SkillState, createModuleState } from './state'

export interface PersistedLearning {
	modules?: Record<string, Partial<ModuleState> | ModuleState>
}

export function getPersistedLearning(state: LearningState): PersistedLearning {
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

function normalizeModuleState(id: string, state: unknown): ModuleState | null {
	if (!isRecord(state)) return null
	if (state.moduleType === 'concept') return normalizeConceptState(id, state)
	if (state.moduleType === 'skill') return normalizeSkillState(id, state)
	return null
}

function normalizeConceptState(id: string, state: Record<string, unknown>): ConceptState {
	return { ...createModuleState(id, 'concept'), ...normalizeCommonModuleFields(id, state) }
}

function normalizeSkillState(id: string, state: Record<string, unknown>): SkillState {
	return {
		...createModuleState(id, 'skill'),
		...normalizeCommonModuleFields(id, state),
		solvedExerciseCount: typeof state.solvedExerciseCount === 'number' && Number.isInteger(state.solvedExerciseCount) && state.solvedExerciseCount >= 0 ? state.solvedExerciseCount : 0,
		exerciseHistory: Array.isArray(state.exerciseHistory) ? state.exerciseHistory.map(exercise => normalizeExerciseInstance(exercise)).filter((exercise): exercise is ExerciseInstance => exercise !== null) : [],
	}
}

function normalizeCommonModuleFields(id: string, state: Record<string, unknown>): Pick<ModuleState, 'id' | 'tab' | 'lastAccessed' | 'understood'> {
	const normalized: Pick<ModuleState, 'id' | 'tab' | 'lastAccessed' | 'understood'> = { id }
	if (typeof state.tab === 'string') normalized.tab = state.tab
	const lastAccessed = coerceTimestamp(state.lastAccessed)
	if (lastAccessed !== undefined) normalized.lastAccessed = lastAccessed
	if (state.understood === true) normalized.understood = true
	return normalized
}

function coerceTimestamp(value: unknown): number | undefined {
	if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
	if (typeof value !== 'string') return undefined
	const timestamp = new Date(value).getTime()
	return Number.isFinite(timestamp) ? timestamp : undefined
}
