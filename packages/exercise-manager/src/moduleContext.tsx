import { type ComponentType, type ReactNode, createContext, useContext } from 'react'

// A per-module provider a skill prescribes to wrap its practice (or none).
export type ModuleProviderComponent = ComponentType<{ skillId: string; children: ReactNode }>

// Transient subject-specific capabilities forwarded to exercise generation and reduction.
const ModuleContext = createContext<unknown>(undefined)

export function ModuleContextProvider({ value, children }: { value: unknown; children: ReactNode }) {
	return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
}

export function useModuleContext(): unknown {
	return useContext(ModuleContext)
}
