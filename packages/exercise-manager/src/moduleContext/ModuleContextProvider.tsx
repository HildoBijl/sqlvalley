import type { ComponentType, ReactNode } from 'react'

import { ModuleContext } from './context'

export type ModuleProviderComponent = ComponentType<{ moduleId: string; children: ReactNode }>

export function ModuleContextProvider({ value, children }: { value: unknown; children: ReactNode }) {
	return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
}
