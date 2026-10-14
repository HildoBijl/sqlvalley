import { useTheme } from '@mui/material'

import { useSkillTreeData } from '../core'
import { Explorer, ExplorerContent } from '../explorer'
import { SkillTreeIntro, useSkillTreeIntro } from '../intro'
import { TreeLegend } from '../legend'
import { PlanningModeIntro, PlanningProgressIndicator } from '../planning'
import { SkillTreeDrawing } from '../rendering'

import { SkillTreeControls } from './SkillTreeControls'
import type { SkillTreeSettings, SkillTreeStateHandles } from './types'

interface SkillTreeVisualizationContentProps {
	settings?: SkillTreeSettings
	stateHandles?: SkillTreeStateHandles
}

// Assemble the drawing, overlays, and modals within the visualization providers.
export function SkillTreeVisualizationContent({ settings, stateHandles }: SkillTreeVisualizationContentProps) {
	const theme = useTheme()

	// Load in settings for the Explorer tool.
	const { modulePositioning } = useSkillTreeData()
	const { bounds } = modulePositioning
	const { allowZoom = true, initialZoom = 1 } = settings ?? {}

	// Load in the handles for the intro modal.
	const { showIntro, openIntro, closeIntro } = useSkillTreeIntro(stateHandles?.intro, stateHandles?.ready !== false)

	// Render the full Skill Tree Visualization.
	return <div style={{
		width: '100%',
		height: 'calc(100vh - 120px)',
		minHeight: '600px',
		border: `1px solid ${theme.palette.divider}`,
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
	}}>
		{/* Contents. */}
		<Explorer bounds={bounds} initialScale={initialZoom} allowZoom={allowZoom}>
			{/* Skill Tree. */}
			<ExplorerContent>
				<SkillTreeDrawing />
			</ExplorerContent>

			{/* Overlay components. */}
			<SkillTreeControls onHelp={openIntro} />
			<PlanningProgressIndicator />
			<TreeLegend stateHandles={stateHandles?.legend} />
		</Explorer>

		{/* Modals. */}
		<SkillTreeIntro open={showIntro} onClose={closeIntro} />
		<PlanningModeIntro />
	</div>
}
