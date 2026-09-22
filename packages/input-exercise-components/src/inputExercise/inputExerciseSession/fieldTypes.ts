import type { ReactNode } from 'react'

export type FieldValidationResult = { valid: false; feedback?: ReactNode } | { valid: true; report?: unknown }

export interface InputFieldOptions {
	type: string
	normalizeInput?: (value: unknown) => unknown
	validate?: (options: { rawInput: unknown; normalizedInput: unknown; context: unknown; signal: AbortSignal }) => FieldValidationResult | Promise<FieldValidationResult>
}
