import type { InputExerciseRawInput } from '@step-wise/input-exercises'

export const sqlValueTypes = {
	SQL: {
		inputValue: {
			isInputValue: (value: unknown): value is { type: 'SQL'; value: string } =>
				typeof value === 'object' && value !== null && 'type' in value && value.type === 'SQL' && 'value' in value && typeof value.value === 'string',
			isDomainValue: (value: unknown): value is string => typeof value === 'string',
			interpret: (input: { type: 'SQL'; value: string }) => input.value,
			toInputValue: (value: string) => ({ type: 'SQL', value: value.trim() }),
		},
	},
}

export const fromRawInput = (input: InputExerciseRawInput): string => {
	const query = input.query
	if (query?.type !== 'SQL' || typeof query.value !== 'string') throw new Error('Invalid SQL input.')
	return query.value
}

export function resolveValue<Parameters>(value: string | ((parameters: Parameters) => string), parameters: Parameters): string {
	return typeof value === 'function' ? value(parameters) : value
}
