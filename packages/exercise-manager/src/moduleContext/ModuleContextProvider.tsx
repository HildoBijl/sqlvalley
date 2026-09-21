import type { ComponentType, ReactNode } from 'react'

import { ModuleContext } from './context'
import type { ModuleContextStatus } from './types'

export type ModuleProviderComponent = ComponentType<{ moduleId: string; children: ReactNode }>

export function ModuleContextProvider<Context extends ModuleContextStatus>({ value, children }: { value: Context; children: ReactNode }) {
	return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
}
