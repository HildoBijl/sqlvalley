import { useContext } from 'react'

import { ModuleContext } from './context'
import type { ModuleContextStatus } from './types'

export function useModuleContext(): ModuleContextStatus | undefined {
	return useContext(ModuleContext)
}
