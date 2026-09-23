import type { ReactNode } from 'react'

import type { PlainDataValue } from '@step-wise/js-utils'
import type { InputValue } from '@step-wise/input-interpretation'

/*
 * Options for the useInputField hook.
 */

export interface InputFieldOptions {
	type: string
	normalizeInput: (value: unknown) => InputValue
	hydrateInput: (value: InputValue) => PlainDataValue
	getFeedback?: (options: FieldFeedbackOptions) => InputFeedback | undefined
	validate?: (options: { rawInput: unknown; normalizedInput: unknown; context: unknown; signal: AbortSignal }) => FieldValidationResult | Promise<FieldValidationResult>
}

/*
 * Field validation.
 */

export interface FieldValidationState {
	status: 'pending' | 'valid' | 'invalid'
	feedback?: ReactNode
	report?: unknown
}

export type FieldValidationResult = { valid: false; feedback?: ReactNode } | { valid: true; report?: unknown }

/*
 * Field feedback.
 */

export interface InputFeedback {
	type: 'success' | 'info' | 'warning' | 'error'
	message: ReactNode
}

export interface FieldFeedbackOptions {
	report: PlainDataValue | undefined
	input: unknown
	expected: unknown
	rawInput: InputValue
	context: unknown
}
