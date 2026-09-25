import type { ComponentType, ReactNode } from 'react'

import { ModuleContext } from './context'
import type { ExerciseResources } from '../exerciseSessionContext'

export type ModuleProviderComponent = ComponentType<{ moduleId: string; children: ReactNode }>

export function ModuleContextProvider<Context>({ value, children }: { value: ExerciseResources<Context>; children: ReactNode }) {
	return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
}
