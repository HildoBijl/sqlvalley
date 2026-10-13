import { useTheme } from '@mui/material'

import type { Vector } from '@step-wise/geometry'
import { Curve, Drawing } from '@step-wise/drawing'
import type { ModuleTree } from '@step-wise/module-tree-definition'
import { isReadyToLearn } from '@sqlvalley/progress'

import type { ModulePositionData } from '../positioning'
import { resolveConnectorStyle } from '../utils/graphics/connectorStyle'
import { useHoverState } from '../utils/graphics/mouseEvents'
import { useGoalProgress } from '../utils/logic/useGoalProgress'

import { NodeCard } from './SkillTreeComponents/NodeCard'
import { Tooltip } from './SkillTreeComponents/Tooltip'

// Render the tree nodes and connectors without zoom or pan controls.
interface SkillTreeProps {
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
	isCompleted: (id: string) => boolean
	planningMode: boolean
	goalNodeId?: string | null
	setGoalNodeId?: (id: string | null) => void
	onGoalProgressChange?: (
		completedCount: number,
		totalCount: number,
		nextStepName: string | null,
		nextStepId: string | null,
	) => void
	nextStepId?: string | null
	staticMode?: boolean
}

export function SkillTree({
	moduleTree,
	modulePresentation,
	modulePositions,
	treeBounds,
	visiblePaths,
	isCompleted,
	planningMode,
	goalNodeId,
	setGoalNodeId,
	onGoalProgressChange,
	nextStepId,
	staticMode,
}: SkillTreeProps) {
	const theme = useTheme()

	const onNavigate = (id: string) => {
		window.location.href = `/module/${id}`
	}

	const {
		localHoveredId,
		prerequisites,
		tooltip,
		selectedId,
		handleHoverStart,
		handleHoverEnd,
		isConnectorInHoveredPath,
		handlePointerDown,
		handlePointerOutside,
	} = useHoverState(moduleTree, modulePresentation, onNavigate)

	const goalPath = useGoalProgress(goalNodeId, moduleTree, modulePresentation, isCompleted, onGoalProgressChange)

	if (treeBounds.width <= 0 || treeBounds.height <= 0) return null

	return <div
			onPointerDown={handlePointerOutside}
			style={{
				position: 'relative',
				width: `${treeBounds.width}px`,
				height: `${treeBounds.height}px`,
				marginLeft: '35px',
				marginTop: '35px',
				backgroundColor: theme.palette.background.paper,
			}}>
			<Drawing view={{ type: 'identity', width: treeBounds.width, height: treeBounds.height, yDirection: 'down' }}>
				{visiblePaths.map((connector, i) => {
					const { strokeColor, strokeWidth, opacity } = resolveConnectorStyle(
						connector,
						planningMode,
						goalNodeId,
						goalPath,
						localHoveredId,
						isCompleted,
						moduleTree,
						isConnectorInHoveredPath,
						staticMode,
					)

					return <Curve
							key={i}
							positions={connector.points}
							stroke={strokeColor}
							strokeWidth={strokeWidth}
							smoothing={{ mode: 'around', distance: 20 }}
							style={{ opacity }}
					/>
				})}

				{Object.values(modulePositions).map(positionData => {
					const item = moduleTree[positionData.id]
					if (!item) return null

					const readyToLearn = isReadyToLearn(moduleTree, item.id, isCompleted)

					return <NodeCard
							key={item.id}
							onMouseEnter={() => handleHoverStart(item.id)}
							onMouseLeave={handleHoverEnd}
							onPointerDown={e => {
								e.stopPropagation()
								const isGoal = planningMode && goalNodeId === item.id
								handlePointerDown(item.id, e, isGoal)
							}}
							item={item}
							name={modulePresentation[item.id]?.name ?? item.id}
							positionData={modulePositions[item.id]}
							completed={isCompleted(item.id)}
							isHovered={localHoveredId === item.id}
							readyToLearn={readyToLearn}
							isPrerequisite={prerequisites.has(item.id)}
							isSomethingHovered={localHoveredId !== null}
							isSelected={selectedId === item.id}
							planningMode={planningMode}
							hasGoal={planningMode && !!goalNodeId}
							isGoalNode={planningMode && goalNodeId === item.id}
							isOnGoalPath={planningMode && goalPath.has(item.id)}
							onSetGoal={() => {
								if (planningMode && setGoalNodeId) {
									setGoalNodeId(goalNodeId === item.id ? null : item.id)
								}
							}}
							nextStepId={nextStepId}
							staticMode={staticMode}
						/>
				})}

				<Tooltip>{tooltip}</Tooltip>
			</Drawing>
	</div>
}
