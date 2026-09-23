import type { InputExerciseRawInput } from '@step-wise/input-exercises'

import { isSqlInputValue, interpretSqlInputValue } from '../../sqlInput'

export const fromRawInput = (input: InputExerciseRawInput): string => {
	const query = input.query
	if (!isSqlInputValue(query)) throw new Error('Invalid SQL input.')
	return interpretSqlInputValue(query)
}

export function resolveValue<Parameters>(value: string | ((parameters: Parameters) => string), parameters: Parameters): string {
	return typeof value === 'function' ? value(parameters) : value
}
