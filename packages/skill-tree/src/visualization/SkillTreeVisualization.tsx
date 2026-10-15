import { type SkillTreeDataProviderProps, SkillTreeDataProvider } from '../core'
import { type SkillTreeProgressProviderProps, SkillTreeProgressProvider } from '../progress'
import { type SkillTreeInteractionProviderProps, SkillTreeInteractionProvider } from '../interaction'
import { SkillTreePlanningProvider } from '../planning'

import { SkillTreeVisualizationContent } from './SkillTreeVisualizationContent'
import type { SkillTreeSettings, SkillTreeStateHandles } from './types'

export interface SkillTreeVisualizationProps
	extends Omit<SkillTreeDataProviderProps, 'children'>,
	Omit<SkillTreeProgressProviderProps, 'children'>,
	Omit<SkillTreeInteractionProviderProps, 'children'> {
	settings?: SkillTreeSettings
	stateHandles?: SkillTreeStateHandles
}

// On the outer layer, wrap all providers together, each getting their respective settings.
export function SkillTreeVisualization({
	moduleTree,
	modulePresentation,
	modulePositioning,
	isModuleCompleted,
	getModuleHref,
	settings,
	stateHandles,
}: SkillTreeVisualizationProps) {
	return <SkillTreeDataProvider moduleTree={moduleTree} modulePresentation={modulePresentation} modulePositioning={modulePositioning}>
		<SkillTreeProgressProvider isModuleCompleted={isModuleCompleted}>
			<SkillTreePlanningProvider settings={settings} stateHandles={stateHandles?.planning}>
				<SkillTreeInteractionProvider getModuleHref={getModuleHref}>
					<SkillTreeVisualizationContent settings={settings} stateHandles={stateHandles} />
				</SkillTreeInteractionProvider>
			</SkillTreePlanningProvider>
		</SkillTreeProgressProvider>
	</SkillTreeDataProvider>
}
