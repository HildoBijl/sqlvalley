import type { ModuleId } from '@step-wise/module-tree-definition'

import { type SkillTreeDataProviderProps, SkillTreeDataProvider } from '../core'
import { type SkillTreeProgressProviderProps, SkillTreeProgressProvider } from '../progress'
import { SkillTreeInteractionProvider } from '../interaction'
import { SkillTreePlanningProvider } from '../planning'

import { SkillTreeVisualizationContent } from './SkillTreeVisualizationContent'
import type { SkillTreeSettings, SkillTreeStateHandles } from './types'

export interface SkillTreeVisualizationProps extends Omit<SkillTreeDataProviderProps, 'children'>, Omit<SkillTreeProgressProviderProps, 'children'> {
	settings?: SkillTreeSettings
	stateHandles?: SkillTreeStateHandles
}

// What should we do on a click on a module?
const navigateToModule = (id: ModuleId) => { window.location.href = `/module/${id}` }

// On the outer layer, wrap all providers together, each getting their respective settings.
export function SkillTreeVisualization({
	moduleTree,
	modulePresentation,
	modulePositioning,
	isCompleted,
	settings,
	stateHandles,
}: SkillTreeVisualizationProps) {
	return <SkillTreeDataProvider moduleTree={moduleTree} modulePresentation={modulePresentation} modulePositioning={modulePositioning}>
		<SkillTreeProgressProvider isCompleted={isCompleted}>
			<SkillTreePlanningProvider settings={settings} stateHandles={stateHandles?.planning}>
				<SkillTreeInteractionProvider onNavigate={navigateToModule}>
					<SkillTreeVisualizationContent settings={settings} stateHandles={stateHandles} />
				</SkillTreeInteractionProvider>
			</SkillTreePlanningProvider>
		</SkillTreeProgressProvider>
	</SkillTreeDataProvider>
}
