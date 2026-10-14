import { useTheme } from '@mui/material'

import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'

import { type ModulePresentation, SkillTreeDataProvider, useSkillTreeData } from '../core'
import { useSkillTreeTransform, ZoomControls } from '../explorer'
import { SkillTreeIntro, useSkillTreeIntro } from '../intro'
import { SkillTreeInteractionProvider } from '../interaction'
import { TreeLegend } from '../legend'
import { PlanningModeIntro, PlanningProgressIndicator, SkillTreePlanningProvider, useSkillTreePlanning } from '../planning'
import type { ModulePositioning } from '../positioning'
import { SkillTreeProgressProvider } from '../progress'
import type { SkillTreeSettings, SkillTreeStateHandles } from '../types'

import { SkillTreeDrawing } from '../rendering'

// Assemble the skill tree with zoom, pan, planning, legend, and help controls.
export interface SkillTreeVisualizationProps {
	moduleTree: ModuleTree
	modulePresentation: ModulePresentation
	modulePositioning: ModulePositioning
	isCompleted?: (id: ModuleId) => boolean
	settings?: SkillTreeSettings
	stateHandles?: SkillTreeStateHandles
}

const navigateToModule = (id: ModuleId) => { window.location.href = `/module/${id}` }

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

type SkillTreeVisualizationContentProps = Pick<SkillTreeVisualizationProps, 'settings' | 'stateHandles'>

function SkillTreeVisualizationContent({ settings, stateHandles }: SkillTreeVisualizationContentProps) {
	const { modulePositioning } = useSkillTreeData()
	const { bounds } = modulePositioning
	const { allowZoom = true, initialZoom = 1 } = settings ?? {}
	const { planningEnabled, planningMode, togglePlanningMode } = useSkillTreePlanning()

	const { outerRef, transform, bind, zoomBy, reset } = useSkillTreeTransform({
		bounds,
		initialScale: initialZoom,
		allowZoom,
	})

	const { showIntro, openIntro, closeIntro } = useSkillTreeIntro(stateHandles?.intro, stateHandles?.ready !== false)

	const theme = useTheme()

	return <div
		ref={outerRef}
		style={{
			width: '100%',
			height: 'calc(100vh - 120px)',
			minHeight: '600px',
			border: `1px solid ${theme.palette.divider}`,
			overflow: 'hidden',
			backgroundColor: theme.palette.background.paper,
			position: 'relative',
		}}>
		<ZoomControls
			onZoomIn={() => zoomBy(1.2)}
			onZoomOut={() => zoomBy(1 / 1.2)}
			onReset={reset}
			onCenter={reset}
			onTogglePlanningMode={planningEnabled ? togglePlanningMode : undefined}
			planningMode={planningMode}
			allowZoom={allowZoom}
			onHelp={openIntro}
		/>
		{planningMode && <PlanningProgressIndicator />}
		<TreeLegend stateHandles={stateHandles?.legend} />

		<div
			{...bind()}
			style={{
				width: '100%',
				height: '100%',
				cursor: 'grab',
				touchAction: 'none',
			}}>
			<div
				style={{
					transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
					transformOrigin: '0 0',
					willChange: 'transform',
				}}>
				<SkillTreeDrawing />
			</div>
		</div>

		<PlanningModeIntro />

		<SkillTreeIntro open={showIntro} onClose={closeIntro} />
	</div>
}
