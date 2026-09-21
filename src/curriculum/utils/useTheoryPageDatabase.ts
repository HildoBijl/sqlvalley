import { useGradingModuleDatabase } from '@sqlvalley/sql'

// Theory examples read the original small dataset, independently of user edits.
export function useTheoryPageDatabase() {
	return useGradingModuleDatabase('small')
}
