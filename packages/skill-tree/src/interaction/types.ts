import type { MouseEvent, PointerEvent } from 'react'

import type { ModuleId } from '@step-wise/module-tree-definition'

export interface SkillTreeInteraction {
	highlightModule: (id: ModuleId) => void
	clearModuleHighlight: () => void
	highlightedModuleId: ModuleId | null
	highlightedPrerequisiteIds: Set<ModuleId>
	handleModulePointerDown: (id: ModuleId, event: PointerEvent) => void
	handleModuleClick: (id: ModuleId, event: MouseEvent) => void
	getModuleHref: (id: ModuleId) => string
}
