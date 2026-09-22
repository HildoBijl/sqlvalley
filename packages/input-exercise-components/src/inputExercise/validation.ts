import type { InputExerciseRawInput } from '@step-wise/input-exercises'

// Temporary emptiness check; field-specific validation can refine this later.
export function isInputEmpty(input: InputExerciseRawInput | undefined): boolean {
	return !input || Object.values(input).every(field => typeof field.value === 'string' ? !field.value.trim() : field.value === undefined)
}
