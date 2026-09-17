import { useCallback, useMemo } from 'react'

import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'

import { type ModuleCompletionState, getCompletedModuleIds } from './completion'

// Set up an isCompleted function that checks if a module is completed, based on all data.
export function useModuleCompletion(
	moduleTree: ModuleTree,
	moduleStates: Record<ModuleId, ModuleCompletionState>,
) {
	const completedModuleIds = useMemo(() => getCompletedModuleIds(moduleTree, moduleStates), [moduleTree, moduleStates])
	const isCompleted = useCallback((moduleId: ModuleId) => completedModuleIds.has(moduleId), [completedModuleIds])
	return { isCompleted }
}
