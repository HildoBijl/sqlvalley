import { ensureInteger, sample } from '@step-wise/js-utils'

import type { ExerciseId } from './types'

export interface ExerciseSelectionOptions {
	dontRepeatBefore?: number
	minimumChoices?: number
}

// History is ordered oldest first and includes the most recently presented exercise.
export function selectExercise<Exercise extends { exerciseId: ExerciseId }>(
	exercises: readonly Exercise[],
	history: readonly { exerciseId: ExerciseId }[],
	{ dontRepeatBefore = 3, minimumChoices = 2 }: ExerciseSelectionOptions = {},
): Exercise | undefined {
	dontRepeatBefore = ensureInteger(dontRepeatBefore, { nonNegative: true, safe: true })
	minimumChoices = ensureInteger(minimumChoices, { nonNegative: true, nonZero: true, safe: true })
	const available = [...new Map(exercises.map(exercise => [exercise.exerciseId, exercise])).values()]
	if (available.length === 0) return undefined
	const recentCount = Math.min(dontRepeatBefore, Math.max(0, available.length - minimumChoices))
	const recentIds = new Set(recentCount > 0 ? history.slice(-recentCount).map(exercise => exercise.exerciseId) : [])
	const candidates = available.filter(exercise => !recentIds.has(exercise.exerciseId))
	return sample(candidates)
}
