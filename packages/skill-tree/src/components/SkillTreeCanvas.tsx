import { useTheme } from '@mui/material'

import type { Vector } from '@step-wise/geometry'
import type { ModuleTree } from '@step-wise/module-tree-definition'

import type { SkillTreeMemoryStoreAPI } from '../types/SkillTreeMemoryStoreAPI'
import type { SkillTreeSettings } from '../types/SkillTreeSettings'
import { useSkillTreeTransform, ZoomControls } from '../explorer'
import { PlanningModeIntro, PlanningProgressIndicator, useGoalProgress, useSkillTreePlanning } from '../planning'
import type { ModulePositionData } from '../positioning'
import { useSkillTreeIntro } from '../utils/logic/useSkillTreeIntro'

import { SkillTree } from '../display'
import { SkillTreeIntro } from './SkillTreeComponents/SkillTreeIntro'
import { TreeLegend } from './SkillTreeComponents/TreeLegend'

// Assemble the skill tree with zoom, pan, planning, legend, and help controls.
export interface SkillTreeCanvasProps {
	moduleTree: ModuleTree
	modulePresentation: Record<string, { name: string; description: string }>
	modulePositions: Record<string, ModulePositionData>
	treeBounds: {
		minX: number
		minY: number
		maxX: number
		maxY: number
		width: number
		height: number
	}
	visiblePaths: { points: Vector[]; from: string; to: string }[]
	isCompleted?: (id: string) => boolean
	settings?: SkillTreeSettings
	memoryStoreAPI?: SkillTreeMemoryStoreAPI
}

export function SkillTreeCanvas({
	moduleTree,
	modulePresentation,
	modulePositions,
	treeBounds,
	visiblePaths,
	isCompleted,
	settings,
	memoryStoreAPI,
}: SkillTreeCanvasProps) {
	const { allowZoom = true, initialZoom = 1, allowPlanningMode = true, trackProgress = true } = settings ?? {}

	const staticMode = !trackProgress
	const resolvedIsCompleted = staticMode ? () => false : (isCompleted ?? (() => false))

	const { outerRef, transform, bind, zoomBy, reset } = useSkillTreeTransform({
		treeBounds,
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
		resolvedIsCompleted,
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
						moduleTree={moduleTree}
						modulePresentation={modulePresentation}
						modulePositions={modulePositions}
						treeBounds={treeBounds}
						visiblePaths={visiblePaths}
						isCompleted={resolvedIsCompleted}
						planningMode={allowPlanningMode ? planningMode : false}
						goalNodeId={goalNodeId}
						goalPath={goalPath}
						setGoalNodeId={setGoalNodeId}
						nextStepId={goalProgress.nextStepId}
						staticMode={staticMode}
					/>
				</div>
			</div>

			<PlanningModeIntro open={showPlanningModeModal} onClose={() => setShowPlanningModeModal(false)} />

			<SkillTreeIntro open={showIntro} onClose={() => setShowIntro(false)} />
	</div>
}
