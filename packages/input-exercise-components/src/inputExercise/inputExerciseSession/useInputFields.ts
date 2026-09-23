import { useCallback, useState } from 'react'

import type { PlainDataObject, PlainDataValue } from '@step-wise/js-utils'

import type { InputFieldOptions } from '../fieldTypes'

interface InputFieldsOptions {
	mergeInput: (values: PlainDataObject) => void
}

export function useInputFields({ mergeInput }: InputFieldsOptions) {
	const [fields, setFields] = useState(() => new Map<string, InputFieldOptions>())

	// Set up a registerField handler that can be applied in an effect to register/deregister a field.
	const registerField = useCallback((name: string, options: InputFieldOptions) => {
		setFields(current => {
			if (current.has(name)) throw new Error(`Input field "${name}" is already registered.`)
			return new Map(current).set(name, options)
		})
		return () => setFields(current => {
			if (current.get(name) !== options) return current
			const next = new Map(current)
			next.delete(name)
			return next
		})
	}, [])

	// Add a setter handler to adjust field values.
	const setFieldValue = useCallback((name: string, value: PlainDataValue) => {
		const field = fields.get(name)
		if (!field) throw new Error(`Input field "${name}" is not registered.`)
		mergeInput({ [name]: value })
	}, [fields, mergeInput])

	// All done.
	return { fields, registerField, setFieldValue }
}
