import { useTheme } from '@mui/material'

import { Drawing } from '@step-wise/drawing'

import { useSkillTreeData } from '../core'
import { useSkillTreeInteraction } from '../interaction'

import { ModuleCard } from './ModuleCard'
import { ModuleConnector } from './ModuleConnector'
import { Tooltip } from './Tooltip'

// Render the tree nodes and connectors without zoom or pan controls.
export function SkillTreeDrawing() {
	// Load all necessary data from contexts.
	const theme = useTheme()
	const { modulePositioning } = useSkillTreeData()
	const { modulePositions, connectors, bounds } = modulePositioning
	const { endModuleHover } = useSkillTreeInteraction()

	// Don't build when the drawing has no dimensions.
	if (bounds.width <= 0 || bounds.height <= 0) return null

	// Render the SkillTreeDrawing.
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
			{/* ModuleConnectors. */}
			{connectors.map((connector, index) => <ModuleConnector key={index} connector={connector} />)}

			{/* ModuleCards. */}
			{Object.values(modulePositions).map(({ id }) => <ModuleCard key={id} moduleId={id} />)}

			{/* Tooltips. */}
			<Tooltip />
		</Drawing>
	</div>
}
