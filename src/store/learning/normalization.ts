import type { StoredExerciseEvent, StoredExerciseInstance } from '@sqlvalley/exercise-engine/storedState'

import { isRecord } from '../infrastructure'
import { type ConceptModuleState, type ModuleState, type SkillModuleState, createModuleState } from './state'

export function coerceTimestamp(value: unknown): number | undefined {
	if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
	if (typeof value !== 'string') return undefined
	const timestamp = new Date(value).getTime()
	return Number.isFinite(timestamp) ? timestamp : undefined
}

function normalizeStoredExerciseEvent(value: unknown): StoredExerciseEvent | null {
	if (!isRecord(value)) return null

	const timestamp = coerceTimestamp(value.timestamp)
	if (timestamp === undefined || !isRecord(value.action) || !isRecord(value.resultingState)) return null

	return {
		timestamp,
		action: { ...value.action },
		resultingState: { ...value.resultingState },
		report: value.report,
	}
}

function normalizeStoredExerciseInstance(value: unknown): StoredExerciseInstance | null {
	if (!isRecord(value)) return null

	const exerciseIdRaw = value.exerciseId
	const exerciseId = typeof exerciseIdRaw === 'string' ? exerciseIdRaw.trim() : ''
	if (!exerciseId) return null

	const version = typeof value.version === 'number' && Number.isInteger(value.version) && value.version > 0 ? value.version : 1
	const createdAt = coerceTimestamp(value.createdAt)
	if (createdAt === undefined || !isRecord(value.parameters)) return null
	const parameters = { ...value.parameters }
	const events = Array.isArray(value.events) ? value.events.map(entry => normalizeStoredExerciseEvent(entry)).filter((entry): entry is StoredExerciseEvent => entry !== null) : []

	return { exerciseId, version, parameters, createdAt, events, draftInput: value.draftInput }
}

function normalizeCommonModuleFields(id: string, state: Record<string, unknown>): Pick<ModuleState, 'id' | 'tab' | 'lastAccessed' | 'understood'> {
	const normalized: Pick<ModuleState, 'id' | 'tab' | 'lastAccessed' | 'understood'> = { id }
	if (typeof state.tab === 'string') normalized.tab = state.tab
	const lastAccessed = coerceTimestamp(state.lastAccessed)
	if (lastAccessed !== undefined) normalized.lastAccessed = lastAccessed
	if (state.understood === true) normalized.understood = true
	return normalized
}

export function normalizeConceptModuleState(id: string, state: unknown): ConceptModuleState {
	const base = createModuleState(id, 'concept') as ConceptModuleState
	const common = normalizeCommonModuleFields(id, isRecord(state) ? state : {})
	return { ...base, ...common }
}

export function normalizeSkillModuleState(id: string, state: unknown): SkillModuleState {
	const base = createModuleState(id, 'skill') as SkillModuleState
	const partialSkill = isRecord(state) ? state : {}
	const common = normalizeCommonModuleFields(id, partialSkill)

	const normalized: SkillModuleState = {
		...base,
		...common,
		solvedExerciseCount: typeof partialSkill.solvedExerciseCount === 'number' && Number.isInteger(partialSkill.solvedExerciseCount) && partialSkill.solvedExerciseCount >= 0 ? partialSkill.solvedExerciseCount : 0,
		exerciseHistory: Array.isArray(partialSkill.exerciseHistory) ? partialSkill.exerciseHistory.map(exercise => normalizeStoredExerciseInstance(exercise)).filter((exercise): exercise is StoredExerciseInstance => exercise !== null) : [],
	}
	return normalized
}

export function normalizeModuleState(id: string, state: unknown): ModuleState | null {
	if (!isRecord(state)) return null
	if (state.moduleType === 'concept') return normalizeConceptModuleState(id, state)
	if (state.moduleType === 'skill') return normalizeSkillModuleState(id, state)
	return null
}
