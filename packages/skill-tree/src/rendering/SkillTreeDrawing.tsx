import { useTheme } from '@mui/material'

import { Curve, Drawing } from '@step-wise/drawing'

import { useSkillTreeData } from '../core'
import { isConnectorInHoveredPath, useSkillTreeInteraction } from '../interaction'
import { useSkillTreePlanning } from '../planning'
import { useSkillTreeProgress } from '../progress'

import { resolveConnectorStyle } from './connectorStyle'
import { ModuleCard } from './ModuleCard'
import { Tooltip } from './Tooltip'

// Render the tree nodes and connectors without zoom or pan controls.
export function SkillTreeDrawing() {
	const theme = useTheme()
	const { moduleTree, modulePositioning } = useSkillTreeData()
	const { planningMode, goalModuleId, goalPath } = useSkillTreePlanning()
	const { isCompleted, hasProgress } = useSkillTreeProgress()
	const { modulePositions, connectors, bounds } = modulePositioning
	const staticMode = !hasProgress

	const {
		hoveredModuleId,
		hoveredPrerequisiteIds,
		endModuleHover,
	} = useSkillTreeInteraction()

	if (bounds.width <= 0 || bounds.height <= 0) return null

	return <div
		onPointerDown={endModuleHover}
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
					goalModuleId,
					goalPath,
					hoveredModuleId,
					isCompleted,
					moduleTree,
					isConnectorInHoveredPath(connector, hoveredModuleId, hoveredPrerequisiteIds),
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

			{Object.values(modulePositions).map(({ id }) => <ModuleCard key={id} moduleId={id} />)}

			<Tooltip />
		</Drawing>
	</div>
}
