import { useEffect } from 'react'
import { Container } from '@mui/material'

import { useModuleCompletion } from '@sqlvalley/progress'
import {
	SkillTreeCanvas,
	useTreeBounds,
} from '@sqlvalley/skill-tree'

import { useSkillTreeSettingsStore, useLearningStore } from '@/store'
import { type SkillTreeVisualizationId, modulePresentation, moduleTree, skillTreeVisualizationById } from '@/curriculum'

export function SkillTreeOverviewPage({ treeId }: { treeId: SkillTreeVisualizationId }) {
	const { modulePositions, visiblePaths } = skillTreeVisualizationById.get(treeId)!

	const markSkillTreeVisited = useSkillTreeSettingsStore(
		state => state.markSkillTreeVisited,
	)

	useEffect(() => {
		markSkillTreeVisited(treeId)
	}, [markSkillTreeVisited, treeId])

	const moduleStates = useLearningStore(state => state.modules)

	const { isCompleted } = useModuleCompletion(moduleTree, moduleStates)
	const treeBounds = useTreeBounds(modulePositions)

	const planningMode = useSkillTreeSettingsStore(
		s => s.planningModeByTreeId[treeId] ?? false,
	)
	const setPlanningMode = useSkillTreeSettingsStore(s => s.setPlanningMode)

	const goalNodeId = useSkillTreeSettingsStore(
		s => s.goalNodeIdByTreeId[treeId] ?? null,
	)
	const setGoalNodeId = useSkillTreeSettingsStore(s => s.setGoalNodeId)

	const hasSeenPlanningModeIntro = useSkillTreeSettingsStore(
		s => s.hasSeenPlanningModeIntro,
	)
	const setHasSeenPlanningModeIntro = useSkillTreeSettingsStore(
		s => s.setHasSeenPlanningModeIntro,
	)

	const hasSeenSkillTreeIntro = useSkillTreeSettingsStore(
		s => s.hasSeenSkillTreeIntro,
	)
	const setHasSeenSkillTreeIntro = useSkillTreeSettingsStore(
		s => s.setHasSeenSkillTreeIntro,
	)

	const hideLegend = useSkillTreeSettingsStore(s => s.hideLegend)
	const setHideLegend = useSkillTreeSettingsStore(s => s.setHideLegend)
	const hasHydrated = useSkillTreeSettingsStore(s => s.hasHydrated)

	return <Container maxWidth={false} sx={{ py: 4, maxWidth: '1400px' }}>
		<SkillTreeCanvas
			moduleTree={moduleTree}
			modulePresentation={modulePresentation}
			modulePositions={modulePositions}
			treeBounds={treeBounds}
			visiblePaths={visiblePaths}
			isCompleted={isCompleted}
			memoryStoreAPI={{
				planningMode,
				setPlanningMode: value => setPlanningMode(treeId, value),
				goalNodeId,
				setGoalNodeId: id => setGoalNodeId(treeId, id),
				hasSeenPlanningModeIntro,
				setHasSeenPlanningModeIntro,
				hasSeenSkillTreeIntro,
				setHasSeenSkillTreeIntro,
				hideLegend,
				setHideLegend,
				hasHydrated,
			}}
			settings={{
				allowZoom: true,
				initialZoom: 1,
				allowPlanningMode: true,
				trackProgress: true,
			}} />
	</Container>
}
