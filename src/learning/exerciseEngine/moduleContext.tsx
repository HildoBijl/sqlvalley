import { createContext, useContext, type ComponentType, type ReactNode } from 'react';

/** A per-module provider a skill prescribes to wrap its practice (or none). */
export type ModuleProviderComponent = ComponentType<{ skillId: string; children: ReactNode }>;

/**
 * The subject-specific environment for a module (skill/concept). Opaque to the
 * engine: a SQL module provides database access, a datalog module its own, etc.
 * The ExerciseManager forwards it into generateParameters/reduce.
 */
const ModuleContext = createContext<unknown>(undefined);

export function ModuleContextProvider({ value, children }: { value: unknown; children: ReactNode }) {
  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export function useModuleContext(): unknown {
  return useContext(ModuleContext);
}
