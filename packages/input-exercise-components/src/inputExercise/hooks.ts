import { useContext } from 'react'

import type { InputExerciseContextValue } from './types'
import { InputExerciseContext } from './context'

export function useInputExerciseContext(): InputExerciseContextValue {
	const value = useContext(InputExerciseContext)
	if (!value) throw new Error('useInputExerciseContext must be used within an InputExerciseProvider.')
	return value
}

export function useSolution(): InputExerciseContextValue['solution'] {
	return useInputExerciseContext().solution
}

export function useInput(): InputExerciseContextValue['input'] {
	return useInputExerciseContext().input
}
