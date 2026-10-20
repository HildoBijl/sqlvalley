import { useEffect } from 'react'
import { Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useModuleCompletion } from '@sqlvalley/progress'
import { SkillTreeVisualization } from '@sqlvalley/skill-tree'

import { useSkillTreeSettingsStore, useSkillTreeStateHandles, useLearningStore } from '@/store'
import { type SkillTreeVisualizationId, modulePresentation, moduleTree, skillTreeVisualizationById } from '@/curriculum'

import { getModulePath } from '../paths'

export function SkillTreeOverviewPage({ treeId }: { treeId: SkillTreeVisualizationId }) {
	const navigate = useNavigate()

	// Register the skill tree as visited, so we know where to send the user back to if needed.
	const markSkillTreeVisited = useSkillTreeSettingsStore(state => state.markSkillTreeVisited)
	useEffect(() => { markSkillTreeVisited(treeId) }, [markSkillTreeVisited, treeId])

	// Load the respective module tree positions/paths.
	const { modulePositioning } = skillTreeVisualizationById.get(treeId)!

	// Load in completion data for the user.
	const moduleStates = useLearningStore(state => state.modules)
	const { isCompleted: isModuleCompleted } = useModuleCompletion(moduleTree, moduleStates)

	// Load the persisted skill-tree state handles.
	const stateHandles = useSkillTreeStateHandles(treeId)

	// Render the skill-tree visualization with the appropriate settings.
	return <Container maxWidth="lg" sx={{ height: '100%', py: 4 }}>
		<SkillTreeVisualization
			moduleTree={moduleTree}
			modulePresentation={modulePresentation}
			modulePositioning={modulePositioning}
			isModuleCompleted={isModuleCompleted}
			getModuleHref={getModulePath}
			navigateToModule={moduleId => navigate(getModulePath(moduleId))}
			stateHandles={stateHandles}
			settings={{ allowZoom: true, initialScale: 1, initialModuleId: 'database', allowPlanningMode: true }} />
	</Container>
}
