import { useTheme } from '@mui/material'

import { Vector } from '@step-wise/geometry'
import { HtmlElement, Rectangle } from '@step-wise/drawing'
import type { ModuleId } from '@step-wise/module-tree-definition'

import { cardHeight, cardWidth } from '../../positioning'
import { useSkillTreeData } from '../../core'
import { ModuleCompletionIndicator, useSkillTreeProgress } from '../../progress'
import { useSkillTreeInteraction } from '../../interaction'
import { ModulePlanningIndicator, planningColors, useSkillTreePlanning } from '../../planning'

import { ModuleTypeIcon } from './ModuleTypeIcon'
import { useModuleCardStyle } from './useModuleCardStyle'

interface ModuleCardProps {
	moduleId: ModuleId
}

// Define settings for rendering the ModuleCard.
const cornerRadius = 12
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
	const { isModuleCompleted } = useSkillTreeProgress()
	const completed = isModuleCompleted(moduleId)

	// Derive interaction data.
	const { getModuleHref, highlightedModuleId, highlightModule, clearModuleHighlight, handleModulePointerDown, handleModuleClick } = useSkillTreeInteraction()
	const isHighlighted = highlightedModuleId === moduleId

	// Derive planning data.
	const { isPlanningModeActive, goalModuleId, goalProgress, setGoalModuleId } = useSkillTreePlanning()
	const hasGoal = goalModuleId !== null
	const isGoalModule = isPlanningModeActive && goalModuleId === moduleId

	// Determine styling and positioning for the module card.
	const { borderColor, fillColor, opacity, strokeWidth } = useModuleCardStyle(moduleId)
	const rectStart = new Vector(positionData.pixelPosition.x - cardWidth / 2, positionData.pixelPosition.y - cardHeight / 2)
	const rectEnd = new Vector(positionData.pixelPosition.x + cardWidth / 2, positionData.pixelPosition.y + cardHeight / 2)

	// Render the ModuleCard.
	return <>
		{/* Base layer that remains visible on fade to hide connector paths behind it. */}
		<Rectangle corners={[rectStart, rectEnd]} cornerRadius={cornerRadius} style={{
			fill: theme.palette.background.paper,
			stroke: theme.palette.divider,
			strokeWidth: 1,
			strokeOpacity: opacity,
		}} />

		{/* ModuleCard Rectangle that gets applied the respective border and fill colors. */}
		<Rectangle corners={[rectStart, rectEnd]} cornerRadius={cornerRadius} style={{
			fill: fillColor,
			stroke: borderColor,
			strokeWidth,
			strokeOpacity: opacity,
			transition: 'fill 90ms, stroke 90ms',
		}} />

		{/* ModuleCard link and text. */}
		<HtmlElement
			position={positionData.pixelPosition}
			anchor={[0, 0]}
			ignoreMouse={false}
			onMouseEnter={() => highlightModule(moduleId)}
			onMouseLeave={clearModuleHighlight}
			style={{ opacity, whiteSpace: 'normal' }}>
			<a
				href={getModuleHref(moduleId)}
				data-skill-tree-module-card
				draggable={false}
				onPointerDown={event => handleModulePointerDown(moduleId, event)}
				onClick={event => handleModuleClick(moduleId, event)}
				style={{
					width: cardWidth,
					height: cardHeight,
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					cursor: 'pointer',
					borderRadius: `${cornerRadius}px`,
					backgroundColor: isHighlighted ? theme.palette.action.hover : 'transparent',
					color: 'inherit',
					textDecoration: 'none',
					userSelect: 'none',
					WebkitTapHighlightColor: 'transparent',
					transition: 'background-color 90ms',
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

					{completed && !isGoalModule && <ModuleCompletionIndicator iconSize={indicatorSize} />}

					{isPlanningModeActive && !isGoalModule && !completed && (!hasGoal || isHighlighted) && <ModulePlanningIndicator variant="set" iconSize={indicatorSize} onActivate={() => setGoalModuleId(moduleId)} />}

					{isPlanningModeActive && hasGoal && goalProgress.nextStepId === moduleId && <ModulePlanningIndicator variant="next-step" iconSize={indicatorSize} />}

					{isPlanningModeActive && isGoalModule && <ModulePlanningIndicator variant="active" iconSize={indicatorSize} onActivate={() => setGoalModuleId(null)} />}

					<div style={{
						width: '100%',
						padding: '0 10px',
						boxSizing: 'border-box',
						textAlign: 'center',
						fontFamily: theme.typography.fontFamily,
						fontWeight: 400,
						fontSize: '17px',
						lineHeight: 1.15,
						color: isPlanningModeActive && isGoalModule ? planningColors.goalContrastText : theme.palette.text.primary,
						textDecoration: 'none',
					}}>
						{name}
					</div>
				</div>
			</a>
		</HtmlElement>
	</>
}
