import { useTheme } from '@mui/material'

import type { VectorLike } from '@step-wise/geometry'

import { gridToPixels } from '../positioning/index.ts'
import { Explorer, ExplorerContent } from '../explorer/index.ts'
import { useSkillTreeData } from '../core/index.ts'
import { SkillTreeIntro, useSkillTreeIntro } from '../intro/index.ts'
import { SkillTreeLegend } from '../legend.tsx'
import { PlanningModeIntro, PlanningProgressPanel } from '../planning/index.ts'
import { SkillTreeDrawing } from '../rendering/index.ts'

import { SkillTreeControls } from './SkillTreeControls.tsx'
import type { SkillTreeSettings, SkillTreeStateHandles } from './types.ts'

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
	const { allowZoom = true, initialScale = 1, minScale = 0, maxScale = 1.5, treePadding = 30, initialModuleId, initialGridPosition } = settings ?? {}
	if (initialModuleId && initialGridPosition) throw new Error('Provide either initialModuleId or initialGridPosition, not both.')
	if (initialModuleId && !modulePositions[initialModuleId]) throw new Error(`Cannot focus on module "${initialModuleId}" because it is not positioned in this tree.`)
	const initialFocusPosition: VectorLike | undefined = initialModuleId ? modulePositions[initialModuleId].pixelPosition : initialGridPosition && gridToPixels(initialGridPosition)

	// Load in the handles for the intro modal.
	const { showIntro, openIntro, closeIntro } = useSkillTreeIntro(stateHandles?.intro, stateHandles?.isReady !== false)

	// Render the full Skill Tree Visualization.
	return <div style={{
		width: '100%',
		height: '100%',
		minHeight: 0,
		border: `1px solid ${theme.palette.divider}`,
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
	}}>
		{/* Contents. */}
		<Explorer contentBounds={bounds} initialFocusPosition={initialFocusPosition} initialScale={initialScale} minScale={minScale} maxScale={maxScale} allowZoom={allowZoom} contentPadding={treePadding}>
			{/* Skill Tree. */}
			<ExplorerContent>
				<SkillTreeDrawing />
			</ExplorerContent>

			{/* Overlay components. */}
			<SkillTreeControls onHelp={openIntro} />
			<PlanningProgressPanel />
			<SkillTreeLegend stateHandles={stateHandles?.legend} />

			{/* Modals. */}
			<SkillTreeIntro open={showIntro} onClose={closeIntro} />
			<PlanningModeIntro />
		</Explorer>
	</div>
}
