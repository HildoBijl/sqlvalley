import { useCallback, useContext, useEffect } from 'react'

import type { InputExerciseContextValue } from './types'
import { InputExerciseContext } from './context'

export function useInputExerciseContext(): InputExerciseContextValue {
	const value = useContext(InputExerciseContext)
	if (!value) throw new Error('useInputExerciseContext must be used within an InputExerciseProvider.')
	return value
}

// Extract the solution object.
export function useSolution(): InputExerciseContextValue['solution'] {
	return useInputExerciseContext().solution
}

// Register field metadata while mounted; values stay in draft storage.
export function useInputField(name: string, type: string) {
	const { input, registerField, setFieldValue } = useInputExerciseContext()
	useEffect(() => registerField(name, type), [registerField, name, type])
	const setValue = useCallback((value: unknown) => setFieldValue(name, type, value), [setFieldValue, name, type])
	return { value: input?.[name], setValue }
}
