import { type SkillTreeDataProviderProps, SkillTreeDataProvider } from '../core/index.ts'
import { type SkillTreeProgressProviderProps, SkillTreeProgressProvider } from '../progress/index.ts'
import { type SkillTreeInteractionProviderProps, SkillTreeInteractionProvider } from '../interaction/index.ts'
import { SkillTreePlanningProvider } from '../planning/index.ts'

import { SkillTreeVisualizationContent } from './SkillTreeVisualizationContent.tsx'
import type { SkillTreeSettings, SkillTreeStateHandles } from './types.ts'

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
	navigateToModule,
	settings,
	stateHandles,
}: SkillTreeVisualizationProps) {
	return <SkillTreeDataProvider moduleTree={moduleTree} modulePresentation={modulePresentation} modulePositioning={modulePositioning}>
		<SkillTreeProgressProvider isModuleCompleted={isModuleCompleted}>
			<SkillTreePlanningProvider settings={settings} stateHandles={stateHandles?.planning}>
				<SkillTreeInteractionProvider getModuleHref={getModuleHref} navigateToModule={navigateToModule}>
					<SkillTreeVisualizationContent settings={settings} stateHandles={stateHandles} />
				</SkillTreeInteractionProvider>
			</SkillTreePlanningProvider>
		</SkillTreeProgressProvider>
	</SkillTreeDataProvider>
}
