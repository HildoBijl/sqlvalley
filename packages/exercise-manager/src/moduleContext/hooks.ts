import { useContext } from 'react'

import { ModuleContext } from './context'

export function useModuleContext(): unknown {
	return useContext(ModuleContext)
}
