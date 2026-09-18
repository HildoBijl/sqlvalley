import { isPlainDataObject, isPlainDataValue, isPlainObject } from '@step-wise/js-utils'
import { isExerciseAction } from '@step-wise/exercise-definition'

import type { ExerciseEvent, ExerciseInstance } from './types'

// Only the current instance format is accepted; historical formats belong in store migrations.
export function normalizeExerciseInstance(value: unknown): ExerciseInstance | null {
	if (!isPlainObject(value) || value.mode !== 'solo') return null
	const exerciseId = typeof value.exerciseId === 'string' ? value.exerciseId.trim() : ''
	if (!exerciseId || typeof value.version !== 'number' || !Number.isSafeInteger(value.version) || value.version < 1) return null
	if (typeof value.startedAt !== 'number' || !Number.isFinite(value.startedAt)) return null
	if (!isPlainDataObject(value.parameters) || !isPlainDataObject(value.initialState) || !Array.isArray(value.history)) return null
	const history = value.history.map(normalizeExerciseEvent).filter((event): event is ExerciseEvent => event !== null)
	return {
		mode: 'solo',
		exerciseId,
		version: value.version,
		parameters: { ...value.parameters },
		initialState: { ...value.initialState },
		startedAt: value.startedAt,
		history,
		...(isPlainDataValue(value.draftInput) ? { draftInput: value.draftInput } : {}),
	}
}

function normalizeExerciseEvent(value: unknown): ExerciseEvent | null {
	if (!isPlainObject(value) || typeof value.submittedAt !== 'number' || !Number.isFinite(value.submittedAt)) return null
	if (!isExerciseAction(value.action) || !isPlainDataObject(value.state)) return null
	return {
		submittedAt: value.submittedAt,
		action: { ...value.action },
		state: { ...value.state },
		...(isPlainDataObject(value.report) ? { report: value.report } : {}),
	}
}
