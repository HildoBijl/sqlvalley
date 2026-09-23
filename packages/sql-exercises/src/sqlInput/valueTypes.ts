export const sqlType = 'SQL'
export type SqlType = typeof sqlType

export interface SqlInputValue {
	type: SqlType
	value: string
}

/*
 * Value type conversion: between InputValue and DomainValue.
 */

export function isSqlInputValue(value: unknown): value is SqlInputValue {
	return typeof value === 'object' && value !== null && 'type' in value && value.type === sqlType && 'value' in value && typeof value.value === 'string'
}

export function isSqlDomainValue(value: unknown): value is string {
	return typeof value === 'string'
}

export function interpretSqlInputValue(input: SqlInputValue): string {
	return input.value
}

export function toSqlInputValue(value: string): SqlInputValue {
	return { type: sqlType, value: value.trim() }
}

export const sqlValueTypes = {
	[sqlType]: {
		inputValue: {
			isInputValue: isSqlInputValue,
			isDomainValue: isSqlDomainValue,
			interpret: interpretSqlInputValue,
			toInputValue: toSqlInputValue,
		},
	},
}

/*
 * Input normalization/hydration: between InputState and InputValue. Because the DomainValue equals the InputState - they're both just strings - functionality can be reused.
 */

export function normalizeInput(inputState: unknown): SqlInputValue {
	if (inputState !== undefined && !isSqlDomainValue(inputState)) throw new Error('Invalid SQL input state.')
	return toSqlInputValue(inputState ?? '')
}

export function hydrateInput(inputValue: unknown): string {
	if (!isSqlInputValue(inputValue)) throw new Error('Invalid SQL input value.')
	return interpretSqlInputValue(inputValue)
}
