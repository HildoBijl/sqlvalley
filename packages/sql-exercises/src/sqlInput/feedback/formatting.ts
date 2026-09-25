import type { ReportValue } from '@sqlvalley/sql-grading'

export function formatQuotedList(items: string[], limit = 4, margin = 1): string {
	const quoted = items.map(item => `"${item}"`)
	return quoted.length <= limit + margin ? quoted.join(', ') : `${quoted.slice(0, limit).join(', ')} (and ${quoted.length - limit} more)`
}

export function formatSampleDifferences(differences: Array<{ index: number; row: ReportValue[] }>, includeIndex: boolean, limit = 2): string {
	if (differences.length === 0) return ''
	const samples = differences.slice(0, limit)
	const label = samples.length === 1 ? 'Example' : 'Examples'
	const formatted = samples.map(sample => `${includeIndex ? `row ${sample.index + 1}: ` : ''}(${sample.row.map(formatReportValue).join(', ')})`)
	return ` ${label}: ${formatted.join('; ')}`
}

function formatReportValue(value: ReportValue): string {
	if (value === null) return 'NULL'
	if (typeof value === 'string') return JSON.stringify(value)
	if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
	if (typeof value === 'number') return String(value)
	if (value.type === 'undefined') return 'undefined'
	if (value.type === 'number') return value.value
	return `X'${value.value.map(byte => byte.toString(16).padStart(2, '0')).join('')}'`
}
