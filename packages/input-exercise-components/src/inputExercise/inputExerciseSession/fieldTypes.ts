import type { ReactNode } from 'react'

import type { PlainDataValue } from '@step-wise/js-utils'
import type { InputValue } from '@step-wise/input-interpretation'

export type FieldValidationResult = { valid: false; feedback?: ReactNode } | { valid: true; report?: unknown }

export interface InputFieldOptions {
	type: string
	normalizeInput: (value: unknown) => InputValue
	hydrateInput: (value: InputValue) => PlainDataValue
	validate?: (options: { rawInput: unknown; normalizedInput: unknown; context: unknown; signal: AbortSignal }) => FieldValidationResult | Promise<FieldValidationResult>
}
