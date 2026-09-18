import type { ExerciseState } from '../exerciseSelection'
import type { SimpleExerciseStoredState } from './types'

export const emptySimpleExerciseState: SimpleExerciseStoredState = {}

export function isSimpleExerciseSolved(state: ExerciseState | undefined): boolean {
	return !!state && 'solved' in state && state.solved === true
}

export function isSimpleExerciseGivenUp(state: ExerciseState | undefined): boolean {
	return !!state && 'givenUp' in state && state.givenUp === true
}
