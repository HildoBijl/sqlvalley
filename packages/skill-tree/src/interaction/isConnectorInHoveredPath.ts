import type { ModuleId } from '@step-wise/module-tree-definition'

import type { ModuleConnector } from '../positioning'

export function isConnectorInHoveredPath(
	connector: Pick<ModuleConnector, 'from' | 'to'>,
	hoveredModuleId: ModuleId | null,
	hoveredPrerequisiteIds: Set<ModuleId>,
): boolean {
	if (!hoveredModuleId) return false
	return hoveredPrerequisiteIds.has(connector.from) && (hoveredPrerequisiteIds.has(connector.to) || connector.to === hoveredModuleId)
}
