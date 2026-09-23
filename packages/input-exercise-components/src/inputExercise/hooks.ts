import { useCallback, useContext, useEffect } from 'react'

import type { PlainDataValue } from '@step-wise/js-utils'

import type { InputExerciseContextValue } from './types'
import type { InputFieldOptions } from './fieldTypes'
import { InputExerciseContext } from './context'
import { useFieldFeedback } from './useFieldFeedback'

// Get the full context value.
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
export function useInputField(name: string, options: InputFieldOptions) {
	const { input, registerField, setFieldValue, getFieldValidation } = useInputExerciseContext()
	const { type, normalizeInput, hydrateInput, validate, getFeedback } = options
	useEffect(() => registerField(name, { type, normalizeInput, hydrateInput, validate, getFeedback }), [registerField, name, type, normalizeInput, hydrateInput, validate, getFeedback])
	const feedback = useFieldFeedback(name)
	const setValue = useCallback((value: PlainDataValue) => setFieldValue(name, value), [setFieldValue, name])
	return { value: input?.[name], setValue, validation: getFieldValidation(name), feedback }
}
