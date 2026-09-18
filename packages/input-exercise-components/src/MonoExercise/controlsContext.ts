import { type ReactNode, createContext, useContext } from 'react'

// Shared control state for the exercise buttons.
export interface MonoExerciseControlsValue {
	solved: boolean
	givenUp: boolean
	canSubmit: boolean
	canGiveUp: boolean
	onSubmit: () => void
	onGiveUp: () => void
	onNext: () => void
	adminControls?: ReactNode
}

export const MonoExerciseControlsContext = createContext<MonoExerciseControlsValue | null>(null)

export function useMonoExerciseControls(): MonoExerciseControlsValue {
	const value = useContext(MonoExerciseControlsContext)
	if (!value) throw new Error('useMonoExerciseControls must be used within a MonoExercise view.')
	return value
}
