import { useCallback, useRef } from 'react'

import type { InputExerciseRawInput, InputExerciseValueOperations } from '@step-wise/input-exercises'

interface InputFieldsOptions {
	valueOperations: InputExerciseValueOperations
	mergeInput: (values: InputExerciseRawInput) => void
}

export function useInputFields({ valueOperations, mergeInput }: InputFieldsOptions) {
	const fields = useRef(new Map<string, string>())

	// Function that registers fields and their types.
	const registerField = useCallback((name: string, type: string) => {
		if (fields.current.has(name)) throw new Error(`Input field "${name}" is already registered.`)
		fields.current.set(name, type)
		return () => { fields.current.delete(name) }
	}, [])

	// Function that allows the setting of one field value.
	const setFieldValue = useCallback((name: string, type: string, value: unknown) => {
		mergeInput({ [name]: valueOperations.toInputValue(value, type) })
	}, [valueOperations, mergeInput])

	// All done.
	return { fields, registerField, setFieldValue }
}
