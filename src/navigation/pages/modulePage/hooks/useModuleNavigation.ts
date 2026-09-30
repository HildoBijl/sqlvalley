import { useNavigate } from 'react-router-dom'

import { useSkillTreeSettingsStore } from '@/store'
import { type ModuleId, getNextModuleIds, isModuleId } from '@/curriculum'

import { getModulePath } from '../../../paths'
import { useLearningNavigationContext } from '../../../useLearningNavigationContext'

export function useModuleNavigation(moduleId: ModuleId, isModuleCompleted: (id: string) => boolean) {
	// Determine the tree that this module most likely belongs to.
	const { backPath, tree } = useLearningNavigationContext(moduleId)

	// Determine the next module to do after this one.
	const goalNodeId = useSkillTreeSettingsStore(state => tree ? state.goalNodeIdByTreeId[tree.id] : undefined)
	const nextId = getNextModuleIds(moduleId, tree?.moduleIds ?? new Set(), isModuleCompleted, goalNodeId)[0]

	// Set up navigation calls for the respective actions.
	const navigate = useNavigate()
	return {
		returnToOverview: () => navigate(backPath),
		continueToNext: nextId && isModuleId(nextId) ? () => navigate(getModulePath(nextId)) : undefined,
	}
}
