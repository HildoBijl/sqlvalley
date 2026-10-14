import type { ModuleId } from '@step-wise/module-tree-definition'
import type { StateHandle } from '@step-wise/react-utils'

/*
 * Input types: settings and state handles.
 */

export interface SkillTreePlanningSettings {
	allowPlanningMode?: boolean
}

export interface SkillTreePlanningStateHandles {
	planningMode?: StateHandle<boolean>
	goalModuleId?: StateHandle<ModuleId | null>
	hasSeenPlanningModeIntro?: StateHandle<boolean>
}

/*
 * Output types: contents of the planning context.
 */

export interface SkillTreePlanning {
	planningEnabled: boolean
	planningMode: boolean
	goalModuleId: ModuleId | null
	goalPath: Set<ModuleId>
	goalProgress: SkillTreeGoalProgress
	setGoalModuleId: (id: ModuleId | null) => void
	togglePlanningMode: () => void
	showPlanningModeIntro: boolean
	closePlanningModeIntro: () => void
}

export interface SkillTreeGoalProgress {
	completedCount: number
	totalCount: number
	nextStepId: ModuleId | null
	nextStepName: string | null
}
