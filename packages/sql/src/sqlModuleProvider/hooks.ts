import { useModuleContext } from '@sqlvalley/exercise-manager'

import type { SqlModuleContext } from './types'
import { ensureSqlModuleContext } from './context'

export function useSqlModuleContext(): SqlModuleContext {
	return ensureSqlModuleContext(useModuleContext())
}

// Components use user databases; grading databases are reserved for exercise logic.
export function useModuleDatabase(size?: string) {
	return useSqlModuleContext().getUserDatabase(size)
}

export function useModuleTableKeys() {
	return useSqlModuleContext().tableKeys
}
