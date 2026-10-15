import { useTheme } from '@mui/material'

import type { VectorLike } from '@step-wise/geometry'

import { gridToPixels } from '../positioning'
import { Explorer, ExplorerContent } from '../explorer'
import { useSkillTreeData } from '../core'
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
	const { bounds, modulePositions } = modulePositioning
	const { allowZoom = true, initialZoom = 1, minScale = 0, maxScale = 1.5, treePadding = 30, initialModuleId, initialGridPosition } = settings ?? {}
	if (initialModuleId && initialGridPosition) throw new Error('Provide either initialModuleId or initialGridPosition, not both.')
	if (initialModuleId && !modulePositions[initialModuleId]) throw new Error(`Cannot focus on module "${initialModuleId}" because it is not positioned in this tree.`)
	const initialFocus: VectorLike | undefined = initialModuleId ? modulePositions[initialModuleId].pixelPosition : initialGridPosition && gridToPixels(initialGridPosition)

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
		<Explorer bounds={bounds} initialFocus={initialFocus} initialScale={initialZoom} minScale={minScale} maxScale={maxScale} allowZoom={allowZoom} contentPadding={treePadding}>
			{/* Skill Tree. */}
			<ExplorerContent>
				<SkillTreeDrawing />
			</ExplorerContent>

			{/* Overlay components. */}
			<SkillTreeControls onHelp={openIntro} />
			<PlanningProgressIndicator />
			<TreeLegend stateHandles={stateHandles?.legend} />

			{/* Modals. */}
			<SkillTreeIntro open={showIntro} onClose={closeIntro} />
			<PlanningModeIntro />
		</Explorer>
	</div>
}
