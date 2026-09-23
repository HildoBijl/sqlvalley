import { useGradingModuleDatabase } from '@sqlvalley/sql-exercises'

// Theory examples read the original small dataset, independently of user edits.
export function useTheoryPageDatabase() {
	return useGradingModuleDatabase('small')
}
