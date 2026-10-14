import type { SkillTreeIntroStateHandles } from './intro'
import type { SkillTreeLegendStateHandles } from './legend'
import type { SkillTreePlanningSettings, SkillTreePlanningStateHandles } from './planning'

export interface SkillTreeSettings extends SkillTreePlanningSettings {
	allowZoom?: boolean
	initialZoom?: number
}

export interface SkillTreeStateHandles {
	intro?: SkillTreeIntroStateHandles
	legend?: SkillTreeLegendStateHandles
	planning?: SkillTreePlanningStateHandles
	ready?: boolean
}
