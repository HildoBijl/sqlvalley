import { useTheme } from '@mui/material'

import { Curve, Drawing } from '@step-wise/drawing'
import { isReadyToLearn } from '@sqlvalley/progress'

import { useSkillTreeData } from '../core'
import { useSkillTreeInteraction } from '../interaction'
import { useSkillTreeProgress } from '../progress'

import { resolveConnectorStyle } from './connectorStyle'
import { NodeCard } from './NodeCard'
import { Tooltip } from './Tooltip'

// Render the tree nodes and connectors without zoom or pan controls.
interface SkillTreeProps {
	planningMode: boolean
	goalNodeId?: string | null
	goalPath: Set<string>
	setGoalNodeId?: (id: string | null) => void
	nextStepId?: string | null
}

export function SkillTree({
	planningMode,
	goalNodeId,
	goalPath,
	setGoalNodeId,
	nextStepId,
}: SkillTreeProps) {
	const theme = useTheme()
	const { moduleTree, modulePresentation, modulePositioning } = useSkillTreeData()
	const { isCompleted, hasProgress } = useSkillTreeProgress()
	const { modulePositions, connectors, bounds } = modulePositioning
	const staticMode = !hasProgress

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
	} = useSkillTreeInteraction(moduleTree, modulePresentation, onNavigate)

	if (bounds.width <= 0 || bounds.height <= 0) return null

	return <div
		onPointerDown={handlePointerOutside}
		style={{
			position: 'relative',
			width: `${bounds.width}px`,
			height: `${bounds.height}px`,
			marginLeft: '35px',
			marginTop: '35px',
			backgroundColor: theme.palette.background.paper,
		}}>
		<Drawing view={{ type: 'bounds', bounds, width: bounds.width, height: bounds.height, yDirection: 'down' }}>
			{connectors.map((connector, i) => {
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
