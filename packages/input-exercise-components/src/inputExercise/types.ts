import type { Dispatch, ReactNode, SetStateAction } from 'react'

import type { PlainDataObject, PlainDataValue } from '@step-wise/js-utils'
import type { InputExerciseRawInput, InputExerciseSolution } from '@step-wise/input-exercises'

import type { InputFieldOptions } from './fieldTypes'
import type { FieldValidationState } from './inputExerciseSession/useInputValidation'

export interface InputExerciseProviderProps {
	children: ReactNode
}

export interface InputExerciseContextValue {
	// Full input object
	input: PlainDataObject | undefined
	setInput: Dispatch<SetStateAction<PlainDataObject | undefined>>

	// Field registration
	fields: ReadonlyMap<string, InputFieldOptions>
	registerField: (name: string, options: InputFieldOptions) => () => void
	setFieldValue: (name: string, value: PlainDataValue) => void

	// Input validation
	getFieldValidation: (name: string) => FieldValidationState
	allInputsValid: boolean
	validationPending: boolean
	canGiveUp: boolean
	isSubmitButtonEnabled: boolean
	submitInput: () => Promise<void>
	normalizeInput: (input: PlainDataObject | undefined) => InputExerciseRawInput
	hydrateInput: (input: InputExerciseRawInput) => PlainDataObject
	getInputKey: (input: PlainDataObject | undefined) => string

	// Solution generation/insertion
	solution: InputExerciseSolution | undefined
	insertSolution: (() => void) | undefined
}
