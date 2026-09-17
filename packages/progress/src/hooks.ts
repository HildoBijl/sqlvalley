import { useCallback, useMemo } from 'react'

import type { ModuleTree } from '@step-wise/module-tree-definition'

import type { ModuleProgressState } from './types'
import { getProcessedModuleCompletion } from './logic'

export function useModuleProgress(
	moduleTree: ModuleTree,
	moduleStates: Record<string, ModuleProgressState>,
) {
	const completion = useMemo(
		() => getProcessedModuleCompletion(moduleTree, moduleStates),
		[moduleTree, moduleStates],
	)

	const isCompleted = useCallback((id: string) => completion.completed.has(id), [completion])
	return { isCompleted }
}
