import { useCallback, useMemo } from 'react'

import type { ModuleTree } from '@step-wise/module-tree-definition'

import { type ModuleCompletionState, getCompletedModuleIds } from './completion'

export function useModuleCompletion(
	moduleTree: ModuleTree,
	moduleStates: Record<string, ModuleCompletionState>,
) {
	const completedModuleIds = useMemo(
		() => getCompletedModuleIds(moduleTree, moduleStates),
		[moduleTree, moduleStates],
	)

	const isCompleted = useCallback(
		(id: string) => completedModuleIds.has(id),
		[completedModuleIds],
	)
	return { isCompleted }
}
