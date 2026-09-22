import type { Dispatch, ReactNode, SetStateAction } from 'react'

import type { InputExerciseRawInput, InputExerciseSolution } from '@step-wise/input-exercises'

import type { InputFieldOptions } from './inputExerciseSession/fieldTypes'
import type { FieldValidationState } from './inputExerciseSession/useInputValidation'

export interface InputExerciseProviderProps {
	children: ReactNode
}

export interface InputExerciseContextValue {
	// Full input object
	input: InputExerciseRawInput | undefined
	setInput: Dispatch<SetStateAction<InputExerciseRawInput | undefined>>

	// Field registration
	registerField: (name: string, options: InputFieldOptions) => () => void
	setFieldValue: (name: string, value: unknown) => void

	// Input validation
	getFieldValidation: (name: string) => FieldValidationState
	allInputsValid: boolean
	validationPending: boolean
	canGiveUp: boolean
	isSubmitButtonEnabled: boolean
	submitInput: () => Promise<void>
	getInputKey: (input: InputExerciseRawInput | undefined) => string

	// Solution generation/insertion
	solution: InputExerciseSolution | undefined
	insertSolution: (() => void) | undefined
}
