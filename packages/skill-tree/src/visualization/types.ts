import type { ModuleId } from '@step-wise/module-tree-definition'

import type { GridPosition } from '../positioning'
import type { SkillTreeIntroStateHandles } from '../intro'
import type { SkillTreeLegendStateHandles } from '../legend'
import type { SkillTreePlanningSettings, SkillTreePlanningStateHandles } from '../planning'

export interface SkillTreeSettings extends SkillTreePlanningSettings {
	allowZoom?: boolean
	initialZoom?: number
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
	ready?: boolean
}
