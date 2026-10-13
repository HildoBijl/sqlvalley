import type { HTMLAttributes } from 'react'
import { ButtonBase, useTheme } from '@mui/material'

import { Vector } from '@step-wise/geometry'
import { HtmlElement, Rectangle } from '@step-wise/drawing'
import type { Module } from '@step-wise/module-tree-definition'

import { cardHeight, cardWidth } from '../../utils/settings'
import type { ModulePositionMeta } from '../../utils/positionProcessing'
import { treeColors } from '../../utils/graphics/treeColors'
import { getNodeStyle } from '../../utils/graphics/nodeStyle'

import { NodeCompletedMark } from './Icons/NodeCompletedMark'
import { NodeGoalPin } from './Icons/NodeGoalPin'
import { NodeIconBadge } from './Icons/NodeIconBadge'

// Render a module as SVG backgrounds with an interactive HTML card above them.
interface NodeCardProps
	extends Pick<HTMLAttributes<HTMLDivElement>, 'onMouseEnter' | 'onMouseLeave' | 'onPointerDown'> {
	item: Module
	name: string
	positionData: ModulePositionMeta
	completed: boolean
	isHovered: boolean
	readyToLearn?: boolean
	isPrerequisite?: boolean
	isSomethingHovered?: boolean
	planningMode?: boolean
	hasGoal?: boolean
	isGoalNode?: boolean
	isOnGoalPath?: boolean
	onSetGoal?: () => void
	nextStepId?: string | null
	staticMode?: boolean
	isSelected?: boolean
}

export function NodeCard({
	item,
	name,
	positionData,
	completed,
	isHovered,
	readyToLearn = false,
	isPrerequisite = false,
	isSomethingHovered = false,
	planningMode = false,
	hasGoal = false,
	isGoalNode = false,
	isOnGoalPath = false,
	onSetGoal,
	nextStepId,
	staticMode = false,
	isSelected = false,
	onMouseEnter,
	onMouseLeave,
	onPointerDown,
}: NodeCardProps) {
	const theme = useTheme()
	const type = item.type
	const cornerRadius = type === 'concept' ? 4 : 12

	const rectStart = new Vector(positionData.position.x - cardWidth / 2, positionData.position.y - cardHeight / 2)
	const rectEnd = new Vector(positionData.position.x + cardWidth / 2, positionData.position.y + cardHeight / 2)

	const iconSize = 20
	const checkmarkSize = 18

	const { borderColor, fillColor, nodeOpacity, strokeWidth } = getNodeStyle({
		planningMode,
		isGoalNode,
		isOnGoalPath,
		isHovered,
		hasGoal,
		completed,
		readyToLearn,
		isSomethingHovered,
		isPrerequisite,
		theme,
		staticMode,
		isSelected,
	})

	return <>
			<Rectangle
				corners={[rectStart, rectEnd]}
				cornerRadius={cornerRadius}
				style={{
					fill: theme.palette.background.paper,
					stroke: theme.palette.divider,
					strokeWidth: 1,
					strokeOpacity: nodeOpacity,
				}}
			/>
			<Rectangle
				corners={[rectStart, rectEnd]}
				cornerRadius={cornerRadius}
				style={{
					fill: fillColor,
					stroke: borderColor,
					strokeWidth,
					strokeOpacity: nodeOpacity,
					transition: 'fill 90ms, stroke 90ms',
				}}
			/>

			<HtmlElement
				position={positionData.position}
				anchor={[0, 0]}
				ignoreMouse={false}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onPointerDown={onPointerDown}
				style={{ opacity: nodeOpacity, whiteSpace: 'normal' }}>
				<ButtonBase
					focusRipple
					centerRipple
					sx={{
						width: cardWidth,
						height: cardHeight,
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						cursor: 'pointer',
						borderRadius: `${cornerRadius}px`,
						'&:hover': {
							backgroundColor: 'action.hover',
						},
					}}
					TouchRippleProps={{
						style: {
							opacity: 0.3,
						},
					}}>
					<div
						style={{
							width: cardWidth,
							height: cardHeight,
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							pointerEvents: 'none',
						}}>
						<NodeIconBadge type={type} iconSize={iconSize} />

						{completed && !isGoalNode && <NodeCompletedMark iconSize={checkmarkSize} />}

						{planningMode && !isGoalNode && !completed && (!hasGoal || isHovered) && (
							<NodeGoalPin variant="set" checkmarkSize={checkmarkSize} onSetGoal={onSetGoal} />
						)}

						{planningMode && hasGoal && nextStepId === item.id && (
							<NodeGoalPin variant="next-step" checkmarkSize={checkmarkSize} />
						)}

						{planningMode && isGoalNode && (
							<NodeGoalPin variant="active" checkmarkSize={checkmarkSize} onSetGoal={onSetGoal} />
						)}

						<div
							style={{
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
