import { useCallback } from 'react'

import type { PlainDataObject } from '@step-wise/js-utils'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'

import type { InputFieldOptions } from './fieldTypes'

interface InputConversionOptions {
	fields: ReadonlyMap<string, InputFieldOptions>
}

export function useInputConversion({ fields }: InputConversionOptions) {
	// Convert from input state to input value.
	const normalizeInput = useCallback((draft: PlainDataObject | undefined): InputExerciseRawInput => Object.fromEntries([...fields.entries()].map(([name, field]) => [name, field.normalizeInput(draft?.[name])])), [fields])

	// Convert from input value to input state.
	const hydrateInput = useCallback((input: InputExerciseRawInput): PlainDataObject => Object.fromEntries([...fields].filter(([name]) => name in input).map(([name, field]) => [name, field.hydrateInput(input[name])])), [fields])

	// All done. Return the handles.
	return { normalizeInput, hydrateInput }
}
