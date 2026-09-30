import { useEffect } from 'react'
import { Container } from '@mui/material'

import { useModuleCompletion } from '@sqlvalley/progress'
import { SkillTreeCanvas, useTreeBounds } from '@sqlvalley/skill-tree'

import { useSkillTreeSettingsStore, useSkillTreeMemory, useLearningStore } from '@/store'
import { type SkillTreeVisualizationId, modulePresentation, moduleTree, skillTreeVisualizationById } from '@/curriculum'

export function SkillTreeOverviewPage({ treeId }: { treeId: SkillTreeVisualizationId }) {
	// Register the skill tree as visited, so we know where to send the user back to if needed.
	const markSkillTreeVisited = useSkillTreeSettingsStore(state => state.markSkillTreeVisited)
	useEffect(() => { markSkillTreeVisited(treeId) }, [markSkillTreeVisited, treeId])

	// Load the respective module tree positions/paths.
	const { modulePositions, visiblePaths } = skillTreeVisualizationById.get(treeId)!
	const treeBounds = useTreeBounds(modulePositions)

	// Load in completion data for the user.
	const moduleStates = useLearningStore(state => state.modules)
	const { isCompleted } = useModuleCompletion(moduleTree, moduleStates)

	// Load in the memory store API.
	const memoryStoreAPI = useSkillTreeMemory(treeId)

	// Render the Skill Tree canvas with the appropriate settings.
	return <Container maxWidth={false} sx={{ py: 4, maxWidth: '1400px' }}>
		<SkillTreeCanvas
			moduleTree={moduleTree}
			modulePresentation={modulePresentation}
			modulePositions={modulePositions}
			treeBounds={treeBounds}
			visiblePaths={visiblePaths}
			isCompleted={isCompleted}
			memoryStoreAPI={memoryStoreAPI}
			settings={{ allowZoom: true, initialZoom: 1, allowPlanningMode: true, trackProgress: true }} />
	</Container>
}
