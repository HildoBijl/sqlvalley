import type { ModuleId } from '@step-wise/module-tree-definition'

import type { ModuleConnector } from '../positioning'

export function isConnectorInHighlightedPath(
	connector: Pick<ModuleConnector, 'from' | 'to'>,
	highlightedModuleId: ModuleId | null,
	highlightedPrerequisiteIds: Set<ModuleId>,
): boolean {
	if (!highlightedModuleId) return false
	return highlightedPrerequisiteIds.has(connector.from) && (highlightedPrerequisiteIds.has(connector.to) || connector.to === highlightedModuleId)
}
