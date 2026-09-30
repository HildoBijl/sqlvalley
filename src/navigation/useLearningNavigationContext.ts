import { useMemo } from 'react'

import { useSkillTreeSettingsStore } from '@/store'
import { defaultSkillTreeVisualization, isSkillTreeVisualizationId, skillTreeVisualizationById, skillTreeVisualizationDefinitions } from '@/curriculum'

import { getLearningPath } from './paths'

// Given a moduleId, find which tree is most representative of "owning" that module. This is needed for any "back to tree" button.
export function useLearningNavigationContext(moduleId?: string) {
	// Load in the (existing) skill trees the user has visited.
	const history = useSkillTreeSettingsStore(state => state.recentSkillTreeIds)
	const treeHistory = useMemo(() => [...new Set(history.filter(isSkillTreeVisualizationId))], [history])

	// Find one that has the given moduleId. If not present, find ANY skill tree containing the moduleId.
	const visitedTree = treeHistory.map(id => skillTreeVisualizationById.get(id)!).find(tree => moduleId && tree.moduleIds.has(moduleId))
	const tree = visitedTree ?? skillTreeVisualizationDefinitions.find(tree => moduleId && tree.moduleIds.has(moduleId))

	// Return the data as requested.
	const backPath = getLearningPath(tree?.id ?? treeHistory[0] ?? defaultSkillTreeVisualization)
	return { treeHistory, tree, backPath }
}
