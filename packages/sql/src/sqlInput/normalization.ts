export function normalizeSqlQuery(value: unknown): string {
	return typeof value === 'object' && value !== null && 'value' in value && typeof value.value === 'string' ? value.value.trim() : ''
}
