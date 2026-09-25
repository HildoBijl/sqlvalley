import type { ColumnComparisonResult, ComparisonContext } from '../types'
import { compareColumnsByContent } from './columnsByContent'
import { compareColumnsByName } from './columnsByName'

// Match expected columns to input columns according to the comparison options.
export function compareColumns(context: ComparisonContext): ColumnComparisonResult {
	return context.options.requireEqualColumnNames
		? compareColumnsByName(context)
		: compareColumnsByContent(context)
}
