import type { ModuleId } from '@step-wise/module-tree-definition'

import type { GridPosition } from '../positioning/index.ts'
import type { SkillTreeIntroStateHandles } from '../intro/index.ts'
import type { SkillTreeLegendStateHandles } from '../legend.tsx'
import type { SkillTreePlanningSettings, SkillTreePlanningStateHandles } from '../planning/index.ts'

export interface SkillTreeSettings extends SkillTreePlanningSettings {
	allowZoom?: boolean
	initialScale?: number
	minScale?: number
	maxScale?: number
	treePadding?: number
	initialModuleId?: ModuleId
	initialGridPosition?: GridPosition
}

export interface SkillTreeStateHandles {
	intro?: SkillTreeIntroStateHandles
	legend?: SkillTreeLegendStateHandles
	planning?: SkillTreePlanningStateHandles
	isReady?: boolean
}
