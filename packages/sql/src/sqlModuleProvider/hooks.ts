import { useModuleContext } from '@sqlvalley/exercise-manager'

import type { SqlModuleContext } from './types'
import { ensureSqlModuleContext } from './context'

export function useSqlModuleContext(): SqlModuleContext {
	return ensureSqlModuleContext(useModuleContext())
}

export function useUserModuleDatabase(size?: string) {
	return useSqlModuleContext().getUserDatabase(size)
}

export function useGradingModuleDatabase(size?: string) {
	return useSqlModuleContext().getGradingDatabase(size)
}

export function useModuleTableKeys() {
	return useSqlModuleContext().tableKeys
}
