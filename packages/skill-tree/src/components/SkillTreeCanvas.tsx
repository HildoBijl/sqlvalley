import { useTheme } from '@mui/material'

import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'

import type { SkillTreeMemoryStoreAPI } from '../types/SkillTreeMemoryStoreAPI'
import type { SkillTreeSettings } from '../types/SkillTreeSettings'
import { type ModulePresentation, SkillTreeDataProvider, useSkillTreeData } from '../core'
import { useSkillTreeTransform, ZoomControls } from '../explorer'
import { SkillTreeInteractionProvider } from '../interaction'
import { PlanningModeIntro, PlanningProgressIndicator, useGoalProgress, useSkillTreePlanning } from '../planning'
import type { ModulePositioning } from '../positioning'
import { SkillTreeProgressProvider } from '../progress'
import { useSkillTreeIntro } from '../utils/logic/useSkillTreeIntro'

import { SkillTree } from '../display'
import { SkillTreeIntro } from './SkillTreeComponents/SkillTreeIntro'
import { TreeLegend } from './SkillTreeComponents/TreeLegend'

// Assemble the skill tree with zoom, pan, planning, legend, and help controls.
export interface SkillTreeCanvasProps {
	moduleTree: ModuleTree
	modulePresentation: ModulePresentation
	modulePositioning: ModulePositioning
	isCompleted?: (id: ModuleId) => boolean
	settings?: SkillTreeSettings
	memoryStoreAPI?: SkillTreeMemoryStoreAPI
}

const navigateToModule = (id: ModuleId) => { window.location.href = `/module/${id}` }

export function SkillTreeCanvas({
	moduleTree,
	modulePresentation,
	modulePositioning,
	isCompleted,
	settings,
	memoryStoreAPI,
}: SkillTreeCanvasProps) {
	return <SkillTreeDataProvider moduleTree={moduleTree} modulePresentation={modulePresentation} modulePositioning={modulePositioning}>
		<SkillTreeProgressProvider isCompleted={isCompleted}>
			<SkillTreeInteractionProvider onNavigate={navigateToModule}>
				<SkillTreeCanvasContent settings={settings} memoryStoreAPI={memoryStoreAPI} />
			</SkillTreeInteractionProvider>
		</SkillTreeProgressProvider>
	</SkillTreeDataProvider>
}

type SkillTreeCanvasContentProps = Pick<SkillTreeCanvasProps, 'settings' | 'memoryStoreAPI'>

function SkillTreeCanvasContent({ settings, memoryStoreAPI }: SkillTreeCanvasContentProps) {
	const { moduleTree, modulePresentation, modulePositioning } = useSkillTreeData()
	const { bounds } = modulePositioning
	const { allowZoom = true, initialZoom = 1, allowPlanningMode = true } = settings ?? {}

	const { outerRef, transform, bind, zoomBy, reset } = useSkillTreeTransform({
		bounds,
		initialScale: initialZoom,
		allowZoom,
	})

	const {
		planningMode,
		goalNodeId,
		setGoalNodeId,
		goalProgress,
		handleGoalProgressChange,
		showPlanningModeModal,
		setShowPlanningModeModal,
		togglePlanningMode,
	} = useSkillTreePlanning(memoryStoreAPI)
	const goalPath = useGoalProgress(
		goalNodeId,
		moduleTree,
		modulePresentation,
		handleGoalProgressChange,
	)

	const { showIntro, setShowIntro, openIntro } = useSkillTreeIntro(memoryStoreAPI)

	const theme = useTheme()

	const nextStepModule = goalProgress.nextStepId ? moduleTree[goalProgress.nextStepId] : null
	const nextStepHref = nextStepModule ? `/${nextStepModule.type}/${goalProgress.nextStepId}` : null

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
			onTogglePlanningMode={allowPlanningMode ? togglePlanningMode : undefined}
			planningMode={allowPlanningMode ? planningMode : false}
			allowZoom={allowZoom}
			onHelp={openIntro}
		/>
		{allowPlanningMode && planningMode && (
			<PlanningProgressIndicator
				nextStepName={goalProgress.nextStep || 'All completed!'}
				nextStepHref={nextStepHref}
				completedCount={goalProgress.completed}
				totalCount={goalProgress.total}
				hasGoal={!!goalNodeId}
			/>
		)}
		<TreeLegend hideLegend={memoryStoreAPI?.hideLegend} setHideLegend={memoryStoreAPI?.setHideLegend} />

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
				<SkillTree
					planningMode={allowPlanningMode ? planningMode : false}
					goalNodeId={goalNodeId}
					goalPath={goalPath}
					setGoalNodeId={setGoalNodeId}
					nextStepId={goalProgress.nextStepId}
				/>
			</div>
		</div>

		<PlanningModeIntro open={showPlanningModeModal} onClose={() => setShowPlanningModeModal(false)} />

		<SkillTreeIntro open={showIntro} onClose={() => setShowIntro(false)} />
	</div>
}
