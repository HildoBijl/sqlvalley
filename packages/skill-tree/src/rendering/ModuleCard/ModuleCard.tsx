import { useTheme, ButtonBase } from '@mui/material'

import { Vector } from '@step-wise/geometry'
import { HtmlElement, Rectangle } from '@step-wise/drawing'
import type { ModuleId } from '@step-wise/module-tree-definition'

import { cardHeight, cardWidth } from '../../positioning'
import { treeColors } from '../../styles'
import { useSkillTreeData } from '../../core'
import { ModuleCompletionMark, useSkillTreeProgress } from '../../progress'
import { useSkillTreeInteraction } from '../../interaction'
import { ModuleGoalIndicator, useSkillTreePlanning } from '../../planning'

import { ModuleTypeIcon } from './ModuleTypeIcon'
import { useModuleCardStyle } from './useModuleCardStyle'

interface ModuleCardProps {
	moduleId: ModuleId
}

// Define settings for rendering the ModuleCard.
const iconSize = 20
const indicatorSize = 18

// Render a Module Card as SVG backgrounds with an interactive HTML card above them.
export function ModuleCard({ moduleId }: ModuleCardProps) {
	const theme = useTheme()
	
	// Derive module data.
	const { moduleTree, modulePresentation, modulePositioning } = useSkillTreeData()
	const item = moduleTree[moduleId]
	if (!item) throw new Error(`Unknown module "${moduleId}".`)
	const positionData = modulePositioning.modulePositions[moduleId]
	if (!positionData) throw new Error(`No position was defined for module "${moduleId}".`)
	const name = modulePresentation[moduleId]?.name ?? moduleId
	const type = item.type

	// Derive progress data.
	const { isCompleted } = useSkillTreeProgress()
	const completed = isCompleted(moduleId)

	// Derive interaction data.
	const { hoveredModuleId, startModuleHover, endModuleHover, handleModulePointerDown } = useSkillTreeInteraction()
	const isHovered = hoveredModuleId === moduleId

	// Derive planning data.
	const { planningMode, goalModuleId, goalProgress, setGoalModuleId } = useSkillTreePlanning()
	const hasGoal = goalModuleId !== null
	const isGoalNode = planningMode && goalModuleId === moduleId

	// Determine styling and positioning for the module card.
	const { borderColor, fillColor, opacity, strokeWidth } = useModuleCardStyle(moduleId)
	const cornerRadius = type === 'concept' ? 4 : 12
	const rectStart = new Vector(positionData.pixelPosition.x - cardWidth / 2, positionData.pixelPosition.y - cardHeight / 2)
	const rectEnd = new Vector(positionData.pixelPosition.x + cardWidth / 2, positionData.pixelPosition.y + cardHeight / 2)

	// Render the ModuleCard.
	return <>
		<Rectangle corners={[rectStart, rectEnd]} cornerRadius={cornerRadius} style={{
			fill: theme.palette.background.paper,
			stroke: theme.palette.divider,
			strokeWidth: 1,
			strokeOpacity: opacity,
		}} />
		<Rectangle corners={[rectStart, rectEnd]} cornerRadius={cornerRadius} style={{
			fill: fillColor,
			stroke: borderColor,
			strokeWidth,
			strokeOpacity: opacity,
			transition: 'fill 90ms, stroke 90ms',
		}} />

		<HtmlElement
			position={positionData.pixelPosition}
			anchor={[0, 0]}
			ignoreMouse={false}
			onMouseEnter={() => startModuleHover(moduleId)}
			onMouseLeave={endModuleHover}
			onPointerDown={event => {
				event.stopPropagation()
				handleModulePointerDown(moduleId, event, isGoalNode)
			}}
			style={{ opacity, whiteSpace: 'normal' }}>
			<ButtonBase focusRipple centerRipple TouchRippleProps={{ style: { opacity: 0.3 } }} sx={{
				width: cardWidth,
				height: cardHeight,
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				cursor: 'pointer',
				borderRadius: `${cornerRadius}px`,
				'&:hover': { backgroundColor: 'action.hover' },
			}}>
				<div style={{
					width: cardWidth,
					height: cardHeight,
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'none',
				}}>
						<ModuleTypeIcon type={type} iconSize={iconSize} />

					{completed && !isGoalNode && <ModuleCompletionMark iconSize={indicatorSize} />}

					{planningMode && !isGoalNode && !completed && (!hasGoal || isHovered) && <ModuleGoalIndicator variant="set" iconSize={indicatorSize} onSetGoal={() => setGoalModuleId(moduleId)} />}

					{planningMode && hasGoal && goalProgress.nextStepId === moduleId && <ModuleGoalIndicator variant="next-step" iconSize={indicatorSize} />}

					{planningMode && isGoalNode && <ModuleGoalIndicator variant="active" iconSize={indicatorSize} onSetGoal={() => setGoalModuleId(null)} />}

					<div style={{
						width: cardWidth - 20,
						textAlign: 'center',
						fontWeight: 500,
						fontSize: '17px',
						color: planningMode && isGoalNode ? treeColors.goalContrastText : theme.palette.text.primary,
					}}>
						{name}
					</div>
				</div>
			</ButtonBase>
		</HtmlElement>
	</>
}
