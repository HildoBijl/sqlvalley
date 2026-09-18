import { createContext, useContext } from 'react'

import type { ExerciseAction, ExerciseParameters, ExerciseState } from '@step-wise/exercise-definition'

import type { ExerciseContextValue } from './types'

export type AnyExerciseContextValue = ExerciseContextValue<
	ExerciseParameters,
	ExerciseAction,
	ExerciseState
>

export const ExerciseContext = createContext<AnyExerciseContextValue | null>(null)

// Access the current exercise (definition, exerciseInstance, controls, skill) from within an ExerciseManager.
export function useExercise<
	Parameters extends ExerciseParameters = ExerciseParameters,
	Action extends ExerciseAction = ExerciseAction,
	State extends ExerciseState = ExerciseState,
>(): ExerciseContextValue<Parameters, Action, State> {
	const value = useContext(ExerciseContext)
	if (!value) throw new Error('useExercise must be used within an ExerciseManager.')
	return value as unknown as ExerciseContextValue<Parameters, Action, State>
}
