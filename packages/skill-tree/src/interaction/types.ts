import type { PointerEvent } from 'react'

import type { ModuleId } from '@step-wise/module-tree-definition'

export interface SkillTreeInteraction {
	startModuleHover: (id: ModuleId) => void
	endModuleHover: () => void
	hoveredModuleId: ModuleId | null
	hoveredPrerequisiteIds: Set<ModuleId>
	handleModulePointerDown: (id: ModuleId, event: PointerEvent) => void
	getModuleHref: (id: ModuleId) => string
}
